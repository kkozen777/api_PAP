// const https = require("https");
// const fs = require("fs");
const dotenv = require('dotenv')

dotenv.config({ path: './.env'});

const express = require('express');
const app = express();
const port = 3000;

// const allowedOrigins = [
//     'https://192.168.1.73:8080',
//     'https://192.168.1.68:8081',
//     'https://192.168.1.68:8082'
//   ];

const cors = require('cors');
app.use(cors({
    origin: '*',
    methods: ['GET','POST','PUT','PATCH','DELETE'],
    credentials: true
    //  // Allow all origins, or specify your Vue app's URL (e.g., 'http://vue-app.ngrok.io')
  }));
// const options = {
//     key: fs.readFileSync("./cert/server.key"),
//     cert: fs.readFileSync("./cert/server.cert"),
//   };

app.get("/", (req, res) => {
    res.send("Olá, HTTPS está ativo!");
  });

  
// Habilita o CORS para todas as origens (se você quiser restringir a origens específicas, pode modificar isso)
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Import routes
//const trucksRoute = require('./routes/trucks');
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

const initDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        // Synchronize models with the database
        await sequelize.sync({ force: false }); // Set to true to drop and recreate tables
        console.log('Models synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
        process.exit(1); // Exit the process if the database connection fails
    }
};


// Routes
app.use('/admin', adminRoute);
app.use('/auth', authRoute);
app.use('/users', usersRoute);
app.use('/drivers', driversRoute);
app.use('/driverRoute', driversRouteRoute);
app.use('/driversLocations', driverLocationsRoute);
app.use('/routes', routesRoute);
app.use('/lines', linesRoute);
app.use('/paths', pathsRoute);

// app.use(cors({
//     origin: '*', // Allow all origins, or specify your Vue app's URL (e.g., 'http://vue-app.ngrok.io')
//   }));
   

   
// Start the server
app.listen(port, async () => {
    console.log(`Server running at http://localhost:${port}`);
    await initDatabase();
});

// https.createServer(options, app).listen(443, async () => {
//     console.log("Servidor HTTPS a correr na porta 443");
//         await initDatabase();
//   });