const express = require('express');
const app = express();
const socketio = require('socket.io')

let namespaces = require('./data/namespaces')


app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);
let nsSocket = "";

namespaces.forEach((namespace) => {
    io.of(namespace.endpoint).on('connection', (nsSocket) => {
        console.log(`${nsSocket.id} has joined ${namespace.endpoint}`)

        nsSocket.emit('nsRoomLoad', namespace.rooms)
        nsSocket.on('joinRoom',(roomToJoin, numberOfUsersCallback) => {

            const roomToLeave = roomNameGrabber(nsSocket);
            nsSocket.leave(roomToLeave);
            updateUsersInRoom(namespace,roomToLeave);
            
            nsSocket.join(roomToJoin);
            
            const nsRoom = namespace.rooms.find((room) => {
                return room.roomTitle === roomToJoin
            })
            nsSocket.emit('historyCatchUp',nsRoom.history)

            updateUsersInRoom(namespace,roomToJoin);
            
        })
        nsSocket.on('newMessageToServer', (msg) => {
            const fullMessage = {
                text: msg.text,
                time: Date.now(),
                username: 'Ditdo  ',
                avatar: 'http://via.placeholder.com/30'
            }
           
            const roomTitle = roomNameGrabber(nsSocket)
            const nsRoom = namespace.rooms.find((room) => {
                return room.roomTitle === roomTitle;
            })
            nsRoom.addMessage(fullMessage)
            io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMessage)
        })
    })

})


io.on('connection', (socket) => {
    let nsData = namespaces.map(namespace => {
        return {
            img: namespace.img,
            endpoint: namespace.endpoint
        }
    })
    socket.emit('nsList', nsData);
})


function roomNameGrabber(socket) {
    const roomName = [];
    for (let room of socket.rooms) { roomName.push(room) }
    return roomName[1];
}

async function updateUsersInRoom(namespace, room) {
    const clients = await io.of(namespace.endpoint).in(room).allSockets();
    io.of(namespace.endpoint).in(room).emit('updateMembers',Array.from(clients).length)
    }