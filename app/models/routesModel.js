const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/db'); //config base de dados

const Route = sequelize.define('Route', {
    lineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pathId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    start_time: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    end_time: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'routes', // nome da tabela
    timestamps: true,
});

module.exports = Route;
