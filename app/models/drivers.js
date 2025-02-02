const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/db'); // Sequelize instance

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
    tableName: 'drivers', // Database table name
    timestamps: true,  // Automatically adds createdAt and updatedAt
});

module.exports = Driver;