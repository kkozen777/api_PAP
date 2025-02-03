const validate = require('../middlewares/validation.js'); // Import the middleware
const { createUserSchema } = require('../middlewares/schemas/users.js');
const { updateUserSchema } = require('../middlewares/schemas/users.js');
const verifyToken = require('../middlewares/verifyToken.js'); // Import the middleware

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

// router.patch('/updateUser/:id', validate(updateUserSchema), async (req, res) => {
//     try {
//         const { id } = req.params; // Get User ID from URL
//         const updates = req.body; // Get update data from request body
//         const updatedUser = await userService.updateUser(id,updates);

//         if (updatedUser == null) {
//             return res.status(404).json({ error: 'User does not exist.' });
//         }
//         // Return success response
//         res.status(200).json({ message: 'User updated successfully', updatedUser });
//     } catch (error) {
//         // Handle errors
//         if (error.name === 'SequelizeUniqueConstraintError') {
//             return res.status(400).json({ message: 'email is already in use' });
//         }
//         res.status(500).json({ error: 'Error updating User', details: error.message });
//     }
// });

// router.delete('/deleteUser/:id', async (req, res) => {
//     try {
//         const { id } = req.params;

//         const result = await userService.deleteUser(id);

//         if (result == null) {
//             return res.status(404).json({ error: 'user does not exist.' });
//         }

//         return res.status(200).json(result);
//     } catch (error) {
//         console.error('Error deleting user:', error.message);
//         return res.status(500).json({ error: 'Error deleting user.', details: error.message });
//     }
// });

module.exports = router;