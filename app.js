'use strict'

const express = require('express')
const http = require('http')
const WebSocket = require('ws')

const app = express()

app.use(express.static('public'))

app.get('/', (req, res, next) => {
  res.send('index.html')
})

app.post('/login', function (req, res) {
  res.send({ result: 'OK', message: 'Hit login' })
})

app.delete('/logout', function (request, response) {
  console.log('Destroying session')
})

const server = http.createServer(app)

const wss = new WebSocket.Server({ noServer: true })

server.on('upgrade', function (request, socket, head) {
  wss.handleUpgrade(request, socket, head, function (ws) {
    wss.emit('connection', ws, request)
  })
})

wss.on('connection', (ws, request) => {
  ws.on('message', (message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message)
      }
    })
  })

  ws.on('close', function () {
    console.log('User closed the connection')
  })
})

server.listen(8080, function () {
  console.log('Listening on http://localhost:8080')
})
