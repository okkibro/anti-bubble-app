// --- index.js ---
// • This is the start (entry-point) of our application.
// • Mongoose is used to make communication with MongoDB easy and simple
// -----------------------------------------------------------------------------

const express = require('express')
const path = require('path')
const mongoose = require('./database/mongoose')
const helmet = require('helmet')

var fs = require('fs')
var https = require('https')
var http = require('http')

// • Creating Express instance. Later we will use this to declare routes
const app = express()

app.use(helmet())

//app.use(express.json());

app.use(express.static(path.join(__dirname, 'dist')))

// • This is a special method called `middleware`. Every request will be
// executed on each request. If you want to exclude a specific route to make it
// not enter on this middleware, simply declare that route before this function
app.use('/', function (req, res, next) {
  // • Implement your logic here.
  console.log('Time:', Date.now())
  next()
})

// • We call use() on the Express application to add the Router to handle path,
// specifying an URL path on first parameter '/api/example'.
app.use('/api/example', require('./server/routes/example-route'))

// • Every other route that starts with `api/` but not declared above will
// return `not-found` status. Apply your `not-found` format here.
app.get('/api/*', (req, res) => {
  res.send({
    message: 'Endpoint not found',
    type: 'error'
  })
})

// • Every other route not declared above will redirect us to Angular view
// called `index.html`. Be sure you have builded and created output files from
// angular app.
app.get('*', (req, res) => {
  console.log(req.url)
  res.sendFile(path.join(__dirname, 'dist/index.html'))
})

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