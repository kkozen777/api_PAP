const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/db'); // Sequelize instance

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
    tableName: 'users', // Database table name
    timestamps: true,  // Automatically adds createdAt and updatedAt
});

module.exports = User;