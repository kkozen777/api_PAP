const validate = require('../middlewares/validation'); // Import the middleware

const { createDriverSchema } = require('../middlewares/schemas/drivers');
const { updateDriverSchema } = require('../middlewares/schemas/drivers');

const { createRouteSchema } = require('../middlewares/schemas/routesSchema.js');
const { updateRouteSchema } = require('../middlewares/schemas/routesSchema.js');

const { createLineSchema } = require('../middlewares/schemas/lines.js');
const { updateLineSchema } = require('../middlewares/schemas/lines.js');

// const { createPathSchema } = require('../middlewares/schemas/path.js');
// const { updatePathSchema } = require('../middlewares/schemas/path.js');

const AdminService = require('../services/adminService');

const adminService = new AdminService();
const express = require('express');
const router = express.Router();

router.post('/createDriver', validate(createDriverSchema), async (req, res) => {
    const { driverNumber, password, name } = req.body; //get values from the body
    try {
        const Driver = await adminService.createDriver(driverNumber, password, name);
        if(!Driver){
            return res.status(404).json({ error: 'Driver already exists' });
        }
        res.status(201).json({ message: 'Driver created successfully', driver: Driver });
    } catch (error) {
        res.status(500).json({ error: 'Error creating Driver', details: error.message });
    }
});

router.patch('/updateDriver/:id', validate(updateDriverSchema), async (req, res) => {
    try {
        const { id } = req.params; // Get driver ID from URL
        const updates = req.body; // Get update data from request body
        const updatedDriver = await adminService.updateDriver(id,updates);

        if (updatedDriver == null) {
            return res.status(404).json({ error: 'driver does not exist.' });
        }
        // Return success response
        res.status(200).json({ message: 'Driver updated successfully', updatedDriver });
    } catch (error) {
        // Handle errors
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'driverNumber is already in use' });
        }
        res.status(500).json({ error: 'Error updating driver', details: error });
    }
});

router.delete('/deleteDriver/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await adminService.deleteDriver(id);

        if (result == null) {
            return res.status(404).json({ error: 'driver does not exist.' });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting driver:', error.message);
        return res.status(500).json({ error: 'Error deleting driver.', details: error.message });
    }
});

router.post('/createLine',validate(createLineSchema), async (req, res) => {
    try {
        const { name, schedules } = req.body;
        console.log(name, schedules)
        console.log(req.body)
        const Line = await adminService.createLine(name, schedules);
        res.status(201).json({ message: 'line created successfully', line: Line });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/updateLine/:id', validate(updateLineSchema), async (req, res) => {
    try {
        const { id } = req.params; // Get Line ID from URL
        const updates = req.body; // Get update data from request body
        const updatedLine = await adminService.updateLine(id, updates);

        if (updatedLine == null) {
            return res.status(404).json({ error: 'Line does not exist.' });
        }
        // Return success response
        res.status(200).json({ message: 'Line updated successfully', updatedLine });
    } catch (error) {
        res.status(500).json({ error: 'Error updating line', details: error.message });
    }
});

router.delete('/deleteLine/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await adminService.deleteLine(id);

        if (result == null) {
            return res.status(404).json({ error: 'line does not exist.' });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting line:', error.message);
        return res.status(500).json({ error: 'Error deleting line.', details: error.message });
    }
});

router.post('/createRoute', validate(createRouteSchema), async (req, res) => { 
    const { lineId, pathId, name, start_time, end_time } = req.body;

    try {
        const newRoute = await adminService.createRoute(lineId, pathId, name, start_time, end_time);
        res.status(201).json({ message: 'Route created successfully', route: newRoute });
    } catch (error) {
        console.error('Error creating Route:', error);
        res.status(400).json({ error: 'Error creating Route', details: error.message });
    }
});

router.patch('/updateRoute/:id', validate(updateRouteSchema), async (req, res) => {
    try {
        const { id } = req.params; // Get route ID from URL
        const updates = req.body; // Get update data from request body
        const updatedRoute = await adminService.updateRoute(id, updates);

        if (updatedRoute == null) {
            return res.status(404).json({ error: 'Route does not exist.' });
        }
        // Return success response
        res.status(200).json({ message: 'Route updated successfully', updatedRoute });
    } catch (error) {
        res.status(500).json({ error: 'Error updating route', details: error.message });
    }
});

router.delete('/deleteRoute/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await adminService.deleteRoute(id);

        if (result == null) {
            return res.status(404).json({ error: 'route does not exist.' });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting route:', error.message);
        return res.status(500).json({ error: 'Error deleting route.', details: error.message });
    }
});

router.post('/createPath', async (req, res) => {
    const { name, coordinates } = req.body;
    try {
        const Path = await adminService.createPath(name, coordinates);
        if(!Path){
            return res.status(404).json({ error: 'path already exists' });
        }
        res.status(201).json({ message: 'path created successfully', path: Path });
    } catch (error) {
        res.status(500).json({ error: 'Error creating path', details: error.message });
    }
});

router.patch('/updatePath/:id', async (req, res) => {
    try {
        const { id } = req.params; // Get path ID from URL
        const updates = req.body; // Get update data from request body
        const path = await adminService.updatePath(id, updates);
        if (path) {
            res.status(200).json(path);
        } else {
            res.status(404).json({ message: 'Path not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/deletePath/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await adminService.deletePath(id);

        if (result == null) {
            return res.status(404).json({ error: 'Path does not exist.' });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('Error deleting Path:', error.message);
        return res.status(500).json({ error: 'Error deleting Path.', details: error.message });
    }
});
module.exports = router;