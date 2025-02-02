const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/db');

const Path = sequelize.define('Path', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    coordinates: {
        type: DataTypes.JSON, 
        allowNull: true,
    },
}, {
    tableName: 'paths',
    timestamps: true,
});

module.exports = Path;
