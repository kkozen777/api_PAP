// models/RouteStatus.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/db'); //  Sequelize

const DriverRoute = sequelize.define('DriverRoute', {
    driverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    routeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
}, {
    tableName: 'driverRoute',
    timestamps: true,  // Adiciona createdAt e updatedAt automaticamente
});

module.exports = DriverRoute;
