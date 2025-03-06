const verifyToken = require('../middlewares/verifyToken.js');

const UserService = require('../services/userService.js');
const userService = new UserService();

const express = require('express');
const router = express.Router();

// GET /users
router.get('/', async (req, res) => {
    const users = await userService.getAllUsers();
    res.status(201).json({ message: 'Here are all the users: ', users});
});

router.get('/getUserName', verifyToken, async (req, res) => {
    try {
  
      const id = req.id;
      const name = await userService.getUserName(id);
  
      res.status(201).json(name);
    } catch (err) {
      console.error('Error getting users name', err);
      res.status(500).json({ error: 'Error getting users name' });
    }
  });

module.exports = router;