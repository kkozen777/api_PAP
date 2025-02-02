

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config({ path: './.env'});


const verifyToken = require('../middlewares/verifyToken'); // Import the middleware

const DriverRouteService = require('../services/driverRouteService');
const driverRouteService = new DriverRouteService();
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const drivers = await driverRouteService.getAllBindedRoutes();
  res.status(201).json({ message: 'Here are all the drivers', drivers });
});

router.post('/assign-route', verifyToken, async (req, res) => {
  const driverId = parseInt(req.id, 10); // Certifique-se de que é um número.
  const { routeId } = req.body;
  
    if (!routeId) {
      return res.status(400).json({
        success: false,
        message: 'routeId é obrigatório.',
      });
    }
  
    try {
      const assignedRoute = await driverRouteService.assignRouteToDriver(driverId, routeId);
  
      if (!assignedRoute) {
        return res.status(404).json({
          success: false,
          message: 'Motorista ou rota não encontrada, ou rota já está atribuída.',
        });
      }
  
      return res.status(200).json({
        success: true,
        message: 'Rota atribuída com sucesso ao motorista.',
        data: assignedRoute,
      });
    } catch (error) {
      console.error('Erro ao atribuir rota ao motorista:', error);
      return res.status(500).json({
        success: false,
        message: 'Erro interno ao atribuir rota ao motorista.',
      });
    }
});

router.post('/unssign-route', verifyToken, async (req, res) => {
  const driverId = parseInt(req.id, 10); // Certifique-se de que é um número.

  try {
    const assignedRoute = await driverRouteService.unssignRouteToDriver(driverId);

    if (!assignedRoute) {
      return res.status(404).json({
        success: false,
        message: 'Motorista ou rota não encontrada, ou rota já está atribuída.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Rota retirada do motorista !.',
      data: assignedRoute,
    });
  } catch (error) {
    console.error('Erro ao retirar a rota ao motorista:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao retirar rota ao motorista.',
    });
  }
});

router.get('/driver/status', verifyToken, async (req, res) => {
  try {

    const token = req.headers.authorization?.split(' ')[1]; // Pega o token no cabeçalho

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decodifica o token

    // Pega o driverId do middleware
    const driverId = decoded.id; //parseInt(req.id, 10); // Certifique-se de que é um número.
    // console.log('ID decodificado do token:', driverId); // Adiciona o print do ID para depuração

    // Salva a localização usando o serviço
    const status = await driverRouteService.getBindedDriverStatus(driverId);

    res.status(201).json(status);
  } catch (err) {
    console.error('Erro ao verificar status:', err);
    res.status(500).json({ error: 'Erro ao verificar status' });
  }
});

router.get('/route/getBindedRouteStarted_at/:routeId', async (req, res) => {
  try {
    const { routeId } = req.params;

    const status = await driverRouteService.getBindedRouteStartedTimeByRouteId(routeId);

    res.status(201).json(status);
  } catch (err) {
    console.error('Erro ao verificar status:', err);
    res.status(500).json({ error: 'Erro ao verificar status' });
  }
});

module.exports = router;