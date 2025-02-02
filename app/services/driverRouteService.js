require('dotenv').config(); 
const moment = require('moment');
const DriverRoute = require('../models/driversRoutes');
const Driver = require('../models/drivers');
const Route = require('../models/routesModel');

class driverRouteService {
    
    async getAllBindedRoutes() {
        return await DriverRoute.findAll();
    }

    async getBindedRouteStartedTimeByRouteId(routeId) {
        const route = await DriverRoute.findOne({
            where: { routeId },
            attributes: ['createdAt'],
        });
    
        return route ? moment(route.createdAt).format('HH:mm') : null;
    }

    async getBindedDriverStatus(driverId) {
        return await DriverRoute.findOne({
            where: { driverId },
            attributes: ['status'],
        });
    }

    async assignRouteToDriver(driverId, routeId) {
        // Verifica se o motorista existe
        const driver = await Driver.findByPk(driverId);
        if (!driver) {
            throw new Error('Motorista não encontrado');
        }

        // Verifica se a rota existe
        const route = await Route.findByPk(routeId);
        if (!route) {
            throw new Error('Rota não encontrada');
        }

        // Verifica se já existe uma associação
        const existingAssignment = await DriverRoute.findOne({
            where: { driverId, routeId },
        });

        if (existingAssignment) {
            return false;
        }

        const status = 1;
        // Cria a associação
        const newAssignment = await DriverRoute.create({ driverId, routeId, status });
        await Route.update({ status: 1 }, { where: { id: routeId } });
        return newAssignment;
    }
    
    async unssignRouteToDriver(driverId) {
        // Verifica se o motorista existe
        const driver = await Driver.findByPk(driverId);
        if (!driver) {
            throw new Error('Motorista não encontrado');
        }

        // Verifica se já existe uma associação
        const existingAssignment = await DriverRoute.findOne({
            where: { driverId },
        });

        if (existingAssignment) {
            await Route.update({ status: 0 }, { where: { id: existingAssignment.routeId } });
            return existingAssignment.destroy();
        }
    }
    
    async getDriverRoutes(driverId) {
        return await DriverRoute.findAll({
            where: { driverId },
            include: [Route],
        });
    }
};

module.exports = driverRouteService;
