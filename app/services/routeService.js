require('dotenv').config(); 

// services/routeService.js
const Route = require('../models/routesModel');
const Line = require('../models/lines');
const Path = require('../models/paths');

class RouteService {
    async getAllRoutes() {
        return await Route.findAll();
    }

    async getRouteByDriver(driverId) {
        return await Route.findOne({
            where: { driver_id: driverId },
            include: [{ model: Path }],
        });
    }
    async getRouteById(id) {
        return await Route.findByPk(id);
    }

    async getAvailableRoutes(lineId) {
        const line = await Line.findByPk(lineId);
        if (!line) {
          throw new Error('Linha não encontrada');
        }
      
        // Obtém as rotas disponíveis para a linha com status = 1
        const routes = await Route.findAll({
          where: { 
            lineId: lineId, // Filtra pelo ID da linha
            status: 0       // Apenas rotas inativas
          },
          attributes: ['id','pathId', 'start_time', 'end_time', 'status'], // Dados que você deseja retornar
        });
      
        return routes;
    }
    async getRoutePerline(lineId) {
        const line = await Line.findByPk(lineId);
        if (!line) {
          throw new Error('Linha não encontrada');
        }
      
        // Obtém as rotas disponíveis para a linha com status = 1
        const routes = await Route.findAll({
          where: { 
            lineId: lineId, // Filtra pelo ID da linha
          },       
          attributes: ['id', 'lineId', 'pathId', 'start_time', 'end_time', 'status'], // Dados que você deseja retornar
        });
      
        return routes;
    }

    async getRoutePath(routeId) {
      try{
        const route = await Route.findByPk(routeId);
        if (!route) {
          throw new Error("Rota não encontrada.");
        }

        const path = await Path.findOne({
          where: { id: route.pathId },
        });
        if (!path) {
          throw new Error("Path não encontrado para este pathId.");
        }
        return path;
    }catch (error) {
      console.error("Erro ao buscar o caminho:", error);
      throw error;
    }
  }
}

module.exports = RouteService;