const { Op } = require('sequelize');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { OAuth2Client } = require('google-auth-library');

// Google OAuth client — used to verify ID tokens from the frontend
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      authProviders: ['local'],
    });

    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProviders: user.authProviders,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
};

// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // withPassword scope brings the password column back, like Mongoose's .select('+password')
    const user = await User.scope('withPassword').findOne({ where: { email: email.toLowerCase() } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // If user only signed up with Google, they can't log in with password
    if (!user.authProviders.includes('local')) {
      return res.status(401).json({
        message: 'This account uses Google sign-in. Please use the Google button.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProviders: user.authProviders,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @route   POST /api/auth/google
// @access  Public
// Handles BOTH signup and login + account linking
const googleAuth = async (req, res) => {
  const { credential } = req.body; // The ID token from the frontend

  if (!credential) {
    return res.status(400).json({ message: 'Google credential is required' });
  }

  try {
    // Step 1: Verify the token cryptographically with Google
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    // payload has: sub (googleId), email, name, picture, email_verified, etc.

    if (!payload.email_verified) {
      return res.status(401).json({ message: 'Google email not verified' });
    }

    const { sub: googleId, email, name, picture } = payload;

    // Step 2: Find existing user by googleId OR email
    let user = await User.scope('withPassword').findOne({
      where: { [Op.or]: [{ googleId }, { email: email.toLowerCase() }] },
    });

    if (user) {
      // CASE A: User exists. Link Google if not already linked.
      if (!user.googleId) {
        user.googleId = googleId;
        if (!user.authProviders.includes('google')) {
          user.authProviders = [...user.authProviders, 'google'];
        }
        // Add avatar if we don't have one
        if (!user.avatar && picture) {
          user.avatar = picture;
        }
        await user.save();
      }
    } else {
      // CASE B: New user — create with Google as the only provider
      user = await User.create({
        name,
        email,
        googleId,
        avatar: picture,
        authProviders: ['google'],
        // No password — that's fine because 'local' isn't in authProviders
      });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        authProviders: user.authProviders,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    // Common error: token expired, audience mismatch, malformed token
    res.status(401).json({ message: 'Google authentication failed' });
  }
};

// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  res.json({ success: true, user });
};

module.exports = { signup, login, googleAuth, getMe };
