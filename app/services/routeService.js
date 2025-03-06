// Importação dos modelos necessários 
const Route = require('../models/routesModel'); // Modelo de Rotas
const Line = require('../models/lines'); // Modelo de Linhas
const Path = require('../models/paths'); // Modelo de caminhos

// Definição da classe RouteService para lidar com operações relacionadas a rotas
class RouteService {
  
  // Método para obter todas as rotas disponíveis
  async getAllRoutes() {
    return await Route.findAll();
  }

  // Método para obter uma rota associada a um motorista específico
  async getRouteByDriver(driverId) {
    return await Route.findOne({
      where: { driver_id: driverId }, // Filtra pelo ID do motorista
      include: [{ model: Path }], // Inclui os detalhes do percurso associado à rota
    });
  }

  // Método para obter uma rota pelo seu ID único
  async getRouteById(id) {
    return await Route.findByPk(id); // Busca a rota pela chave primária
  }

  // Método para obter as rotas disponíveis de uma linha específica
  // Um motorista só pode começar a fazer uma rota que ainda não está a ser feita
  async getAvailableRoutes(lineId) {
    const line = await Line.findByPk(lineId); // Verifica se a linha existe
    if (!line) {
        throw new Error('Line not found'); // Lança um erro se a linha não existir
    }

    // Obtém todas as rotas inativas (status = 0) associadas à linha fornecida
    const routes = await Route.findAll({
      where: { 
        lineId: lineId, // Filtra pelo ID da linha
        status: 0       // Apenas rotas inativas
      },
      attributes: ['id', 'pathId', 'start_time', 'end_time', 'status'], // Retorna apenas estes campos
    });

    return routes;
  }

  // Método para obter todas as rotas associadas a uma linha específica
  async getRoutePerLine(lineId) {
    const line = await Line.findByPk(lineId); // Verifica se a linha existe
    if (!line) {
      throw new Error('Line not found'); // Lança um erro se a linha não existir
    }

    // Obtém todas as rotas associadas à linha fornecida
    const routes = await Route.findAll({
      where: { 
        lineId: lineId, // Filtra pelo ID da linha
      },       
      attributes: ['id', 'lineId', 'pathId', 'start_time', 'end_time', 'status'],// Retorna apenas estes campos
    });

    return routes;
  }

  // Método para obter o caminho (Path) associado a uma determinada rota
  async getRoutePath(routeId) {
    try {
      const route = await Route.findByPk(routeId); // Procura a rota pelo ID fornecido
      if (!route) {
        throw new Error("Route not found."); // Lança um erro se a rota não for encontrada
      }

      const path = await Path.findOne({
        where: { id: route.pathId }, // Procura o percurso associado à rota
      });
      if (!path) {
        throw new Error("Path not found for this pathId."); // Lança um erro se o percurso não existir
      }
      return path; // Retorna os detalhes do percurso
    } catch (error) {
      console.error("Error fetching the path:", error); // Regista o erro no console
      throw error; // Lança o erro para ser tratado externamente
    }
  }
}

// Exporta a classe RouteService para que possa ser utilizada noutros ficheiros
module.exports = RouteService;
