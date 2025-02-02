// models/DriverLocation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/db'); // Instância do Sequelize

const DriverLocation = sequelize.define('DriverLocation', {
      driverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: false,
      },
      longitude: {
        type: DataTypes.DECIMAL(9, 6),
        allowNull: false,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW, // Define a data e hora atual como padrão
      },
    }, {
      tableName: 'driversLocations',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['driverId', 'timestamp'], // Cria a restrição UNIQUE
          name: 'unique_driver_timestamp', // Nome opcional para o índice
        },
      ],
    });

module.exports = DriverLocation;
