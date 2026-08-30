const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { signup, login, googleAuth, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const signupValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post('/signup', signupValidation, signup);
router.post('/login', loginValidation, login);
router.post('/google', googleAuth); // No validation — credential is verified by Google
router.get('/me', protect, getMe);

module.exports = router;