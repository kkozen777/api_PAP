const LineService = require('../services/lineService');
const lineService = new LineService();
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const lines = await lineService.getAllLines();
        res.status(201).json(lines);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const line = await lineService.getLineById(req.params.id);
        if (line) {
            res.status(200).json(line);
        } else {
            res.status(404).json({ message: 'Line not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;