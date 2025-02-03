const { DataTypes } = require('sequelize');
const sequelize = require('../config/database/db');
// const Line = require('./lines'); // Importando o modelo Line
// const Path = require('./paths'); // Importando o modelo Path

const Route = sequelize.define('Route', {
    lineId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pathId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // route_begans_at: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    // },
    // route_finishes_at: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    // },
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
    tableName: 'routes',
    timestamps: true,
});

// Route.belongsTo(Line, { foreignKey: 'lineId' });
// Route.belongsTo(Path, { foreignKey: 'pathId' });

module.exports = Route;
