const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');

// IPs permitidos
const allowedIPs = ['...'];

// Domínios permitidos
const allowedOrigins = [
    'https://user.mybus.pt',
    'https://driver.mybus.pt',
    'https://admin.mybus.pt'
];

// Middleware para bloquear IPs não autorizados
app.use((req, res, next) => {
    const clientIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const origin = req.headers.origin || req.headers.referer; // Verifica o domínio de origem

    if (allowedIPs.includes(clientIP) || (origin && allowedOrigins.includes(origin))) {
        next(); // Permite o acesso
    } else {
        return res.status(403).json({ message: 'get out ;)' });
    }
});

// Configurar CORS para apenas os domínios permitidos
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Blocked by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));

// Rota de teste
app.get("/", (req, res) => {
    res.send("Acessado");
});

// Middleware para interpretar JSON
app.use(express.json());

// Importa as rotas
const adminRoute = require('./app/routes/admin');
const authRoute = require('./app/routes/auth');
const usersRoute = require('./app/routes/users');
const driversRoute = require('./app/routes/drivers');
const driversRouteRoute = require('./app/routes/driverRoutes');
const driverLocationsRoute = require('./app/routes/driverLocations');
const routesRoute = require('./app/routes/routesRoute');
const linesRoute = require('./app/routes/lines');
const pathsRoute = require('./app/routes/paths');
const sequelize = require('./app/config/database/db');

// Conexão com a base de dados
const initDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Sincroniza modelos com a base de dados
        await sequelize.sync({ force: false });
        console.log('Models synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        process.exit(1);
    }
};

// Define as rotas
app.use('/admin', adminRoute);
app.use('/auth', authRoute);
app.use('/users', usersRoute);
app.use('/drivers', driversRoute);
app.use('/driverRoute', driversRouteRoute);
app.use('/driversLocations', driverLocationsRoute);
app.use('/routes', routesRoute);
app.use('/lines', linesRoute);
app.use('/paths', pathsRoute);

// Inicia o servidor
app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
    await initDatabase();
});
