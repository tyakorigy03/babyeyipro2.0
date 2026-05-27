'use strict';
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host:    process.env.DB_HOST    || 'localhost',
    port:    parseInt(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
    pool: {
      max:     10,
      min:     0,
      acquire: 30000,
      idle:    10000,
    },
    define: {
      underscored:   true,   // snake_case column names
      timestamps:    true,
      paranoid:      true,   // soft deletes (deleted_at)
    },
  }
);

/**
 * Test the database connection.
 * Called once at server startup.
 */
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅  Database connected  →  %s', process.env.DB_NAME);
  } catch (err) {
    console.error('❌  Unable to connect to the database:', err.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
