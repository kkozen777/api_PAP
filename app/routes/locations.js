const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('get das locations');
});

router.get('/getLocation/:id', (req, res) => {
    res.send('get da location especifica');
});

router.post('/', (req, res) => {
    res.send('criar location');
});

router.patch('/updateLocation/:id', (req, res) => {
    // const driverId = req.params.id; variavel que guarda o id
    res.send('localizacao atualizada');
});

router.delete('/deleteLocation/:id', (req, res) => {
    res.send('lOcalizacao eliminada');
});

module.exports = router;