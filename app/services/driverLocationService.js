require('dotenv').config(); 
7
const DriverLocation = require('../models/driversLocations');
const DriverRoutes = require('../models/driversRoutes')

class DriverLocationService {
    async createDriverLocation(data) {
        return await DriverLocation.create(data);
    }

    async updateDriverLocation(driverId, locationData) {
        return await DriverLocation.create({ driver_id: driverId, ...locationData });
    }

    async getAllLocations() {
        return await DriverLocation.findAll();    
    }

    async getAllLocationsPerRoute(route_Id) {
        const routeDriver = await DriverRoutes.findOne({where:{routeId: route_Id }})
        if (!routeDriver) {
            throw new Error('Nenhum motorista associado a esta rota');
        }
        return await DriverLocation.findAll({
            where: { driverId: routeDriver.driverId },
            order: [['timestamp', 'DESC']],
        });    
    }

    async getLatestLocation(route_id) {
        const routeDriver = await DriverRoutes.findOne({where:{routeId: route_id }})
        if (!routeDriver) {
            throw new Error('Nenhum motorista associado a esta rota');
        }
        return await DriverLocation.findOne({
            where: { driverId: routeDriver.driverId },
            order: [['timestamp', 'DESC']],
        });
    }
}
module.exports = DriverLocationService;
