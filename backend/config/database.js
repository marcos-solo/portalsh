const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use SQLite for development (no external database needed)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_NAME || './ccnaportal.db',
  logging: false,
});

module.exports = sequelize;
