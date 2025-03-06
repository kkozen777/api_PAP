const moment = require('moment'); // Biblioteca para manipulação de datas e horas
const DriverRoute = require('../models/driversRoutes'); // Modelo DriverRoute
const Driver = require('../models/drivers'); // Modelo Driver
const Route = require('../models/routesModel'); // Modelo Route

class DriverRouteService {
    
    // Método para obter todas as atribuições de motoristas a rotas
    async getAllBindedRoutes() {
        return await DriverRoute.findAll();
    }

    // Método para obter a hora de início de uma rota específica, usando o routeId
    async getBindedRouteStartedTimeByRouteId(routeId) {
        const route = await DriverRoute.findOne({
            where: { routeId },
            attributes: ['createdAt'], // Apenas o campo de data de criação
        });
    
        // Formata a data para o formato HH:mm, se a rota existir
        return route ? moment(route.createdAt).format('HH:mm') : null;
    }

    // Método para obter o estado de uma atribuição de motorista usando o driverId
    async getBindedDriverStatus(driverId) {
        return await DriverRoute.findOne({
            where: { driverId },
            attributes: ['status'],
        });
    }

    // Atribui uma rota a um motorista
    async assignRouteToDriver(driverId, routeId) {
        // Verifica se o motorista existe
        const driver = await Driver.findByPk(driverId);
        if (!driver) {
            throw new Error('Driver not found');
        }

        // Verifica se a rota existe
        const route = await Route.findByPk(routeId);
        if (!route) {
            throw new Error('Route not found');
        }

        // Verifica se a atribuição já existe
        const existingAssignment = await DriverRoute.findOne({
            where: { driverId, routeId },
        });

        if (existingAssignment) {
            return false; // Retorna falso se já existir a atribuição
        }

        const status = 1;
        // Cria a nova atribuição
        const newAssignment = await DriverRoute.create({ driverId, routeId, status });
        // Atualiza o estado da rota para "1" (atribuída)
        await Route.update({ status: 1 }, { where: { id: routeId } });
        return newAssignment;
    }
    
    // Remove a atribuição de uma rota de um motorista
    async unassignRouteFromDriver(driverId) {
        // Verifica se o motorista existe
        const driver = await Driver.findByPk(driverId);
        if (!driver) {
            throw new Error('Driver not found');
        }

        // Verifica se há uma atribuição existente
        const existingAssignment = await DriverRoute.findOne({
            where: { driverId },
        });

        if (existingAssignment) {
            // Atualiza o estado da rota para "0" (desatribuída)
            await Route.update({ status: 0 }, { where: { id: existingAssignment.routeId } });
            return existingAssignment.destroy(); // Remove a atribuição
        }
    }
    
    // Obtém a rota atribuida ao motorista
    async getDriverRoutes(driverId) {
        return await DriverRoute.findAll({
            where: { driverId },
            include: [Route], // Inclui os detalhes da rota
        });
    }
};

module.exports = DriverRouteService; // Exporta a classe DriverRouteService
