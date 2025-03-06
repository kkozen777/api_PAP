const { Sequelize } = require('sequelize');
const dotenv = require('dotenv')

dotenv.config({ path: './.env'});

const sequelize = new Sequelize(
  process.env.DB_NAME, // Nome da bd
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST, // Host (ex: localhost)
    dialect: 'mysql', // Tipo de bd (ex: mysql)
  }
);

module.exports = sequelize;