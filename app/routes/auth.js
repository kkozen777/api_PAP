const validate = require('../middlewares/validation.js'); // Importar o middleware
const verifyToken = require('../middlewares/verifyToken.js'); // Importar o middleware

const { createUserSchema, updateUserSchema, updateUserPasswordSchema } = require('../middlewares/schemas/users.js');
const { updateDriverPasswordSchema } = require('../middlewares/schemas/drivers.js');

const AuthService = require('../services/authService.js');
const authService = new AuthService();
const express = require('express');
const router = express.Router();

router.post('/signup', validate(createUserSchema), async (req, res) => {
    const { email, password, name } = req.body;
    
    try {
        const newUser = await authService.signupUser(email, password, name);
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        // Se for erro de user já existente, retorna status 400
        if (error='User already exists') {
          return res.status(400).json({ error: 'User already exists' });
      }
        // Qualquer outro erro retorna status 500
        res.status(500).json({ error: 'Error creating user', details: error.message });
    } 
});

router.post('/loginAdmin', async (req, res) => {
    const { name, password } = req.body;
    try {
        const authResponse = await authService.authenticateAdmin(name, password);
        if (!authResponse) {
            return res.status(401).json({ message: 'Wrong password or name.' });
        }
        
        res.json({ message: 'Login sucessfully!', token: authResponse.token, admin: authResponse.admin });
    } catch (error) {
        res.status(500).json({ message: 'Error login admin.' });
    }
});

router.post('/loginUser', async (req, res) => {
    const { email, password } = req.body;
    try {
        const authResponse = await authService.authenticateUser(email, password);
        if (!authResponse) {
            return res.status(401).json({ message: 'Wrong password or email.' });
        }

        res.json({ message: 'Login sucessfully!', token: authResponse.token, user: authResponse.user });
    } catch (error) {
        res.status(500).json({ message: 'Error login admin.' });
    }
});

router.post('/loginDriver', async (req, res) => {
    const { driverNumber, password, name } = req.body;

    try {
        const authResponse = await authService.authenticateDriver(driverNumber, password, name);
        if (!authResponse) {
            return res.status(401).json({ message: 'Wrong password or email.' });
        }

        res.json({ message: 'Login sucessfully!', token: authResponse.token, driver: authResponse.driver });
    } catch (error) {
        res.status(500).json({ message: 'Error login driver.' });
    }
});

router.get('/isAuthenticated', verifyToken, (req, res) => {
    const token = req.token;
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token not recived' });
    }
  
    const authenticated = authService.isAuthenticated(token);
    if (!authenticated) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
  
    res.json({ success: true, message: 'Valid token' });
});

// para verificar se o token está expirado
router.get('/isTokenExpired', verifyToken, async (req, res) => {
    const token = req.token;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token not recived' });
    }

    try {
        const isExpired = await authService.isTokenExpired(token);
        res.json({ success: true, isExpired });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(500).json({ success: false, message: 'Error verifying token' });
    }
});

// Rota para decodificar o token
router.get('/decodeToken', verifyToken, (req, res) => {
    const token = req.token;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Token not recived' });
    }

    const decoded = authService.decodeToken(token);
    if (!decoded) {
        return res.status(400).json({ success: false, message: 'Failed to decodify the token' });
    }

    res.json({ success: true, decoded });
});

// Rota para obter um valor específico do token
router.get('/getTokenValue/:key',verifyToken, (req, res) => {
    const token = req.token;
    const { key } = req.params;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Token not recived' });
    }

    const value = authService.getTokenValue(token, key);
    if (value === null) {
        return res.status(404).json({ success: false, message: `The value "${key}" to the key wasnt found in the token` });
    }

    res.json({ success: true, value });
});

router.post("/changeUserPassword", verifyToken, validate(updateUserPasswordSchema), async (req, res) => {
  const userId = parseInt(req.id, 10);
  const { currentPassword, newPassword } = req.body;
  console.log(currentPassword)
  console.log(newPassword)
  try {
    const result = await authService.changeUserPassword(userId, currentPassword, newPassword);
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});
  
  // Rota para alterar o email
  router.post("/changeEmail", verifyToken, validate(updateUserSchema), async (req, res) => {
  const userId = parseInt(req.id, 10); 
  const { email } = req.body;
  try {
    const result = await authService.changeEmail(userId, email);
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    res.status(200).json({ message: "Email updated successfully" });
  } catch (error) {
    console.error("Error changing email:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/deleteAccount", verifyToken, async (req, res) => {
  try {
    const userId = req.id;
    const result = await authService.deleteAccount(userId);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/changeDriverPassword", verifyToken, validate(updateDriverPasswordSchema), async (req, res) => {
  const driverId = parseInt(req.id, 10);
  const { currentPassword, newPassword } = req.body;
  console.log(currentPassword)
  console.log(newPassword)
  try {
    const result = await authService.changeDriverPassword(driverId, currentPassword, newPassword);
    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }
    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;