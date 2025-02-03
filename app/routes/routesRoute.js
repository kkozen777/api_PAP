const RouteService = require('../services/routeService');

// Instantiate the service
const routeService = new RouteService();
const express = require('express');
const router = express.Router();

// GET /routes
router.get('/', async (req, res) => {
    const routes = await routeService.getAllRoutes();
    res.status(201).json({ message: 'Here are all the routes', routes });
});

router.get('/availableRoutes/:lineId', async (req, res) => {
    const { lineId } = req.params;
    
    try {
      // Obtém as rotas disponíveis com base no ID da linha
      const availableRoutes = await routeService.getAvailableRoutes(lineId);
      
      if (availableRoutes.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Nenhuma rota disponível para a linha especificada',
        }); 
      }
      
      return res.status(200).json({
        success: true,
        data: availableRoutes,
      });
    } catch (error) {
      console.error('Erro no request:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao mostrar as rotas disponíveis',
      });
    }
});
  
router.get('/getRoutesBylineId/:lineId', async (req, res) => {
    const { lineId } = req.params;
    
    try {
      // Obtém as rotas disponíveis com base no ID da linha
      const availableRoutes = await routeService.getRoutePerLine(lineId);
      
      if (availableRoutes.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Nenhuma rota disponível para a linha especificada',
        });
      }
      
      return res.status(200).json({
        success: true,
        data: availableRoutes,
      });
    } catch (error) {
      console.error('Erro no request:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro ao mostrar as rotas disponíveis',
      });
    }
});

router.get('/driver/:driverId', async (req, res) => {
    try {
        const { driverId } = req.params;
        const route = await routeService.getRouteByDriver(driverId);
        if (route) {
            res.status(200).json(route);
        } else {
            res.status(404).json({ message: 'Route not found for this driver' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// GET bus by id
router.get('/getRoute/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const getRoute = await routeService.getRouteById(id);
        res.status(201).json({ message: 'Here is the Route:', route: getRoute });
    } catch (error) {
        res.status(500).json({ error: 'Error getting Route', details: error.message });
    }
});

// GET bus by id
router.get('/getRoutePath/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const getRoutePath = await routeService.getRoutePath(id);
      res.status(201).json({ message: 'Here is the Route:', route: getRoutePath });
  } catch (error) {
      res.status(500).json({ error: 'Error getting Route', details: error.message });
  }
});

module.exports = router;