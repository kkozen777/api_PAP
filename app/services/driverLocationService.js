//import dos models utilizados
const DriverLocation = require('../models/driversLocations');
const DriverRoutes = require('../models/driversRoutes')

//classe 
class DriverLocationService {
    //criar uma localização
    async createDriverLocation(data) {
        return await DriverLocation.create(data);
    }

    //atualizar uma localização
    async updateDriverLocation(driverId, locationData) {
        return await DriverLocation.create({ driver_id: driverId, ...locationData });
    }

    //obter todas as localizações
    async getAllLocations() {
        return await DriverLocation.findAll();    
    }

    //obter todas as localizações de um motorista numa rota
    async getAllLocationsPerRoute(route_Id) {
        const routeDriver = await DriverRoutes.findOne({where:{routeId: route_Id }})
        if (!routeDriver) {
            throw new Error('No drivers associated');
        }
        return await DriverLocation.findAll({
            where: { driverId: routeDriver.driverId },
            order: [['timestamp', 'DESC']],
        });    
    }

    //funcao para obter a ultima localização enviada de um motorista associado a uma rota
    async getLatestLocation(route_id) {
        const routeDriver = await DriverRoutes.findOne({where:{routeId: route_id }})
        if (!routeDriver) {
            throw new Error('No driver associated');
        }
        return await DriverLocation.findOne({
            where: { driverId: routeDriver.driverId },
            order: [['timestamp', 'DESC']],
        });
    }
}
module.exports = DriverLocationService;
