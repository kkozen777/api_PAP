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
        throw new Error('Line not found');
    }

    // Get available routes for the line with status = 0
    const routes = await Route.findAll({
      where: { 
        lineId: lineId, // Filter by line ID
        status: 0       // Only inactive routes
      },
      attributes: ['id', 'pathId', 'start_time', 'end_time', 'status'], // Data to return
    });

    return routes;
  }

  async getRoutePerLine(lineId) {
    const line = await Line.findByPk(lineId);
    if (!line) {
      throw new Error('Line not found');
    }

    // Get all routes for the line
    const routes = await Route.findAll({
      where: { 
        lineId: lineId, // Filter by line ID
      },       
      attributes: ['id', 'lineId', 'pathId', 'start_time', 'end_time', 'status'], // Data to return
    });

    return routes;
  }

  async getRoutePath(routeId) {
    try {
      const route = await Route.findByPk(routeId);
      if (!route) {
        throw new Error("Route not found.");
      }

      const path = await Path.findOne({
        where: { id: route.pathId },
      });
      if (!path) {
        throw new Error("Path not found for this pathId.");
      }
      return path;
    } catch (error) {
      console.error("Error fetching the path:", error);
      throw error;
    }
  }
}

module.exports = RouteService;