const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/db'); //config da bd

const Path = sequelize.define('Path', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    coordinates: {
        type: DataTypes.JSON, //guarda as coordenadas dos caminhos como JSON
        allowNull: true,
    },
}, {
    tableName: 'paths', //nome da tabela
    timestamps: true,
});

module.exports = Path;
