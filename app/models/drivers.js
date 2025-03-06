const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/db'); // chama o sequelize com a config da bd

const Driver = sequelize.define('Driver', {
    driverNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'drivers', // nome da tabela
    timestamps: true,  // adiciona automaticamente updatedAt e createdAt
});

module.exports = Driver;