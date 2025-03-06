const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/db'); // chama a config da bd atraves do sequelize

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'users', // nome da tabela a ser criada
    timestamps: true,  // adiciona automaticamente createdAt and updatedAt
});

module.exports = User;