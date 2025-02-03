const verifyToken = require('../middlewares/verifyToken.js'); // Import the middleware

const DriverService = require('../services/driverService');

// Instantiate the service
const driverService = new DriverService();
const express = require('express');
const router = express.Router();

// GET /drivers
router.get('/', async (req, res) => {
    const drivers = await driverService.getAllDrivers();
    res.status(201).json({ message: 'Here are all the drivers', drivers });
});

router.get('/getDriverName', verifyToken, async (req, res) => {
    try {
  
      const id = req.id;
      const name = await driverService.getDriverName(id);
  
      res.status(201).json(name);
    } catch (err) {
      console.error('Error getting drivers name:', err);
      res.status(500).json({ error: 'Error getting drivers name' });
    }
  });

module.exports = router;