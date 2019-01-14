const express = require('express')
const app = express()
const router = require('./api/router.js')
const bodyParser = require('body-parser')
const server = require('http').createServer()

app.set('port', 3001)

app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, token')
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  next()
})

server.on('request', app)

router(app)

app.listen(app.get('port'), () => {
  console.log(`Server started: http://localhost:${app.get('port')}/`)
})
