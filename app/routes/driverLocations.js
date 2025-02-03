const express = require('express');
const router = express.Router();
const DriverLocationService = require('../services/driverLocationService');
const driverLocationService = new DriverLocationService();
const verifyToken = require('../middlewares/verifyToken'); // middleware para validar o token


router.get('/', async (req, res) => {
    try {
        const location = await driverLocationService.getAllLocations();
        res.status(201).json(location);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:routeId/locationsPerRoute', async (req, res) => {
    try {
        const { routeId } = req.params;
        const location = await driverLocationService.getAllLocationsPerRoute(routeId);
        res.status(201).json(location);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:routeId/locations/latest', async (req, res) => {
    try {
        const { routeId } = req.params;
        const location = await driverLocationService.getLatestLocation(routeId);
        if (location) {
            res.status(200).json(location);
        } else {
            res.status(404).json({ message: 'No locations found for this driver' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/:driverId/updateLocation', async (req, res) => {
    try {
        const { driverId } = req.params;
        const location = await driverLocationService.updateDriverLocation(driverId, req.body);
        res.status(201).json(location);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', verifyToken, async (req, res) => {
    try {
      const { latitude, longitude } = req.body;
  
      // pede o driverId ao middleware
      const driverId = req.id;
  
      // salva a localização
      const location = await driverLocationService.createDriverLocation({
        driverId,
        latitude,
        longitude,
      });
  
      res.status(201).json(location);
    } catch (err) {
      console.error('Error saving location:', err);
      res.status(500).json({ error: 'Error saving location' });
    }
  });
  

module.exports = router;
