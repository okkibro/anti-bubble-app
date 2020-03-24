const express = require('express');
const path = require('path');
const helmet = require('helmet');
const mongoose = require('./database/mongoose');

const fs = require('fs');
const https = require('https');
const http = require('http');
const app = express();

// Initialize middleware
app.use(helmet());

app.use(express.static(path.join(__dirname, 'dist')));
app.use('/user', require('./server/routes/user-route'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'))
});

// Start listening on port 3000 for requests.
https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app)
.listen(3000, () => console.log(`HTTPS server listening: https://localhost:3000`));

// Redirect HTTP server
const httpApp = express();
httpApp.all('*', (req, res) => res.redirect(303, 'https://localhost:3000'));
const httpServer = http.createServer(httpApp);
httpServer.listen(80, () => console.log(`HTTP server listening: http://localhost:80`));