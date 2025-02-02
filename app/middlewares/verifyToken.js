const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

dotenv.config({ path: './.env'});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  req.token = token;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // decodifica o token
    req.id = decoded.id; // Salva o Id na requisição

    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

module.exports = verifyToken;