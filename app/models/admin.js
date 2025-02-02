const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/db'); // Sequelize instance

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
    tableName: 'admins', // Database table name
    timestamps: true,  // Automatically adds createdAt and updatedAt
});

module.exports = Admin;