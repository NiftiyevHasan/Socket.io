const express = require('express');
const app = express();
const socketio = require('socket.io')

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.on('connection', (socket) => {
    socket.emit('messageFromServer',{data: 'welcome to Scoket Io server'});
    socket.on('newMessageToServer',(dataFromClient) =>  {
        // console.log(dataFromClient)
        io.emit('messageToClients', {text: dataFromClient.text})
    })
})