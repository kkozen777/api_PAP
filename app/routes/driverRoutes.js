const verifyToken = require('../middlewares/verifyToken'); // importa o middleware

const DriverRouteService = require('../services/driverRouteService');
const driverRouteService = new DriverRouteService();
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const drivers = await driverRouteService.getAllBindedRoutes();
  res.status(201).json({ message: 'Here are all the drivers', drivers });
});

router.post('/assign-route', verifyToken, async (req, res) => {
  const driverId = parseInt(req.id, 10);
  const { routeId } = req.body;
  if (!routeId) {
    return res.status(400).json({
      success: false,
      message: 'routeId is required.',
    });
  }
  try {
    const assignedRoute = await driverRouteService.assignRouteToDriver(driverId, routeId);
  
    if (!assignedRoute) {
      return res.status(404).json({
        success: false,
        message: 'Driver or route not found, or route is already assigned.',
      });
    }
  
    return res.status(200).json({
      success: true,
      message: 'Route successfully assigned to the driver.',
      data: assignedRoute,
    });
  } catch (error) {
    console.error('Error assigning route to driver:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal error assigning route to driver.',
    });
  }
});

router.post('/unassign-route', verifyToken, async (req, res) => {
  const driverId = parseInt(req.id, 10);

  try {
    const assignedRoute = await driverRouteService.unassignRouteFromDriver(driverId);

    if (!assignedRoute) {
      return res.status(404).json({
        success: false,
        message: 'Driver or route not found, or route is already unassigned.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Route successfully removed from the driver!',
      data: assignedRoute,
    });
  } catch (error) {
    console.error('Error removing route from driver:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal error removing route from driver.',
    });
  }
});

router.get('/driver/status', verifyToken, async (req, res) => {
  try {
    const driverId = req.id;

    const status = await driverRouteService.getBindedDriverStatus(driverId);

    res.status(201).json(status);
  } catch (err) {
    console.error('Error checking status:', err);
    res.status(500).json({ error: 'Error checking status' });
  }
});

router.get('/route/getBindedRouteStarted_at/:routeId', async (req, res) => {
  try {
    const { routeId } = req.params;

    const status = await driverRouteService.getBindedRouteStartedTimeByRouteId(routeId);

    res.status(201).json(status);
  } catch (err) {
    console.error('Error checking status:', err);
    res.status(500).json({ error: 'Error checking status' });
  }
});

module.exports = router;
