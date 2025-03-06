const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/db');

const Line = sequelize.define('Line', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    schedules: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.TINYINT,
        allowNull: true,
    }
}, {
    tableName: 'lines', //nome da tabela
    timestamps: true,
});

module.exports = Line;