const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/db'); // chama o sequelize com a config da bd

const Admin = sequelize.define('Admin', {
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'admins', // nome da tabela
    timestamps: true, // adiciona automaticamente updatedAt e createdAt
});

module.exports = Admin;