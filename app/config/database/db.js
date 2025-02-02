// const { Sequelize } = require('sequelize');


// const sequelize = new Sequelize('app', 'root', '', {
//     host: 'localhost',
//     dialect: 'mysql',
// });
// require('dotenv').config();

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv')

dotenv.config({ path: './.env'});

const sequelize = new Sequelize(
  process.env.DB_NAME, // Nome do banco de dados
  process.env.DB_USER, // Nome de usuário do banco
  process.env.DB_PASSWORD, // Senha do banco
  {
    host: process.env.DB_HOST, // Host do banco (ex: localhost)
    dialect: 'mysql', // Tipo do banco (ex: mysql)
  }
);

module.exports = sequelize;