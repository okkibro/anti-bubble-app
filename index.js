// --- index.js ---
// • This is the start (entry-point) of our application.
// • Mongoose is used to make communication with MongoDB easy and simple
// -----------------------------------------------------------------------------

const express = require('express');
const path = require('path');
const mongoose = require('./database/mongoose');
const helmet = require('helmet');

var fs = require('fs');
var https = require('https');
var http = require('http');

// • Creating Express instance. Later we will use this to declare routes
const app = express();

app.use(helmet());

//app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/user', require('./server/routes/user-route'));

// • Start listening on port 3000 for requests.
https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
.listen(3000, () => console.log(`HTTPS server listening: https://localhost:3000`));

// redirect HTTP server
const httpApp = express();
httpApp.all('*', (req, res) => res.redirect(303, 'https://localhost:3000'));
const httpServer = http.createServer(httpApp);
httpServer.listen(80, () => console.log(`HTTP server listening: http://localhost:80`));