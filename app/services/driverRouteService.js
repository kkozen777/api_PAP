const moment = require('moment');
const DriverRoute = require('../models/driversRoutes');
const Driver = require('../models/drivers');
const Route = require('../models/routesModel');

class DriverRouteService {
    
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
        // Check if the driver exists
        const driver = await Driver.findByPk(driverId);
        if (!driver) {
            throw new Error('Driver not found');
        }

        // Check if the route exists
        const route = await Route.findByPk(routeId);
        if (!route) {
            throw new Error('Route not found');
        }

        // Check if the assignment already exists
        const existingAssignment = await DriverRoute.findOne({
            where: { driverId, routeId },
        });

        if (existingAssignment) {
            return false;
        }

        const status = 1;
        // Create the assignment
        const newAssignment = await DriverRoute.create({ driverId, routeId, status });
        await Route.update({ status: 1 }, { where: { id: routeId } });
        return newAssignment;
    }
    
    async unassignRouteFromDriver(driverId) {
        // Check if the driver exists
        const driver = await Driver.findByPk(driverId);
        if (!driver) {
            throw new Error('Driver not found');
        }

        // Check if there is an existing assignment
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

module.exports = DriverRouteService;
