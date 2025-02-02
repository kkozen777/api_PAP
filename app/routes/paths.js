// routes/pathRoutes.js
const express = require('express');
const router = express.Router();
const PathService = require('../services/pathService');
const pathService = new PathService();

// Rota para listar todos os Paths
router.get('/', async (req, res) => {
    try {
        const paths = await pathService.getAllPaths();
        res.status(200).json(paths);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Rota para buscar um Path pelo ID
router.get('/:id', async (req, res) => {
    try {
        const path = await pathService.getPathById(req.params.id);
        if (path) {
            res.status(200).json(path);
        } else {
            res.status(404).json({ message: 'Path not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
