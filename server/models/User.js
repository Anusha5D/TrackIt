const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/db');

class User extends Model {
  // Same instance method the controllers already call
  async matchPassword(enteredPassword) {
    if (!this.password) return false; // Google-only user can't password-login
    return bcrypt.compare(enteredPassword, this.password);
  }

  // Reshape output to match what the client already expects from Mongo (_id, no password)
  toJSON() {
    const values = { ...this.get() };
    values._id = values.id;
    delete values.id;
    delete values.password;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Name is required' },
        len: { args: [1, 50], msg: 'Name cannot exceed 50 characters' },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Please enter a valid email' },
      },
    },
    password: {
      // No longer "required" at column level — validated conditionally in the hook below
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: { args: [6, 255], msg: 'Password must be at least 6 characters' },
      },
    },
    // Google's unique user ID — null for password-only users
    googleId: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true, // Postgres treats multiple NULLs as distinct, same effect as Mongo's sparse index
    },
    // Tracks which auth methods this user has connected
    authProviders: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: ['local'],
      validate: {
        isValidProviders(value) {
          const allowed = ['local', 'google'];
          if (!Array.isArray(value) || !value.every((v) => allowed.includes(v))) {
            throw new Error('authProviders can only contain "local" or "google"');
          }
        },
      },
    },
    // Profile picture from Google (optional, nice to have)
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true, // adds createdAt / updatedAt, same as Mongoose's { timestamps: true }
    defaultScope: {
      attributes: { exclude: ['password'] }, // mirrors Mongoose's `select: false` on password
    },
    scopes: {
      withPassword: { attributes: {} }, // use User.scope('withPassword') to get the password back, like .select('+password')
    },
    hooks: {
      // Custom validation: password is required ONLY if 'local' is in authProviders
      beforeValidate(user) {
        if (user.authProviders?.includes('local') && !user.password) {
          throw new Error('Password is required for email/password accounts');
        }
      },
      // Normalize email (lowercase, trim) and hash password before save,
      // same behavior as the old Mongoose pre-save hooks combined
      beforeSave: async (user) => {
        if (user.email) user.email = user.email.trim().toLowerCase();
        if (!user.changed('password') || !user.password) return;
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      },
    },
  }
);

module.exports = User;
