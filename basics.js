const http = require('http')

const server = http.createServer((request,response) => {
    response.end("connected")
})

const io = require("socket.io")(server, {
    cors: {
      origin: '*',
    },
  });io.on('connection', (socket) => {
    socket.emit('welcome','Hello from your server')
    socket.on('message', (message) => {
        console.log(message)
    })
})

server.listen(8000)