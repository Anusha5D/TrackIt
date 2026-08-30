require('dotenv').config(); // ensure env vars are loaded even if this file is required before server.js's dotenv.config()
const { Sequelize } = require('sequelize');

// DATABASE_URL example: postgresql://user:password@localhost:5432/trackr
// Managed providers (Neon, Supabase, Render Postgres, etc.) require SSL on every
// connection — including from local dev — so we detect that from the URL itself
// rather than from NODE_ENV, which would otherwise only enable SSL in production
// and break local dev against a cloud database with ECONNRESET.
const isLocalDb = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL || '');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: isLocalDb
    ? {}
    : { ssl: { require: true, rejectUnauthorized: false } },
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log(`PostgreSQL connected: ${sequelize.config.host}`);

    // Creates tables from the models if they don't exist yet.
    // Fine for a small app like this; use real migrations if this grows.
    await sequelize.sync();
    console.log('Database synced');
  } catch (error) {
    console.error(`DB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
