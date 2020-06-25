/*
 * This program has been developed by students from the bachelor Computer Science at Utrecht University
 * within the Software Project course. © Copyright Utrecht University (Department of Information and
 * Computing Sciences)
 */

const express = require('express');
const path = require('path');
const helmet = require('helmet');
const mongoose = require('./database/mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');

const dotenv = require('dotenv');
dotenv.config();

const fs = require('fs');
const https = require('https');
const http = require('http');
const app = express();

require('./src/app/shared/passport');

// Initialize middleware
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cors());
app.use(passport.initialize());

// Define routing
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/user', require('./server/routes/user-route'));
app.use('/shop', require('./server/routes/shop-route'));
app.use('/class', require('./server/routes/class-route'));
app.use('/session', require('./server/routes/session-route'));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Start listening on port 3000 for requests.
const server = https.createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app)
    .listen(3000, () => console.log(`HTTPS server listening: https://localhost:3000`));

// Redirect HTTP server
const httpApp = express();
httpApp.all('*', (req, res) => res.redirect(303, 'https://localhost:3000'));
const httpServer = http.createServer(httpApp);
httpServer.listen(80, () => console.log(`HTTP server listening: http://localhost:80`));

//SocketIO
const io = require('socket.io').listen(server);
const sockets = require('./server/sockets')(io);

/** This program has been developed by students from the bachelor Computer Science at Utrecht University within the Software Project course. © Copyright Utrecht University (Department of Information and Computing Sciences)  */