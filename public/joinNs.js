
function joinNs(endpoint) {
    if(nsSocket){
        nsSocket.close();
        document.querySelector('#user-input').removeEventListener('submit', formSubmission)
    }
    nsSocket = io(`http://localhost:9000${endpoint}`)
    nsSocket.on('nsRoomLoad', (nsRooms) => {
        let roomList = document.querySelector('.room-list')
        roomList.innerHTML = ""
        nsRooms.forEach((room) => {
            roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${room.privateRoom ? 'lock' : 'globe'}"></span>${room.roomTitle}</li>`
        })
        let roomNodes = document.querySelectorAll('.room');
        roomNodes.forEach((room) => {
            room.addEventListener('click', (event) => {
                joinRoom(event.target.innerText);
            })
        })

        const topRoom = document.querySelector('.room');
        const topRoomName = topRoom.innerText;
        joinRoom(topRoomName);
    })

    nsSocket.on('messageToClients', (msg) => {
        const template = buildHTML(msg);
        document.querySelector('#messages').innerHTML += template;
    })

    document.querySelector('.message-form').addEventListener('submit', formSubmission)
}

function formSubmission(event){
    event.preventDefault()
    const newMessage = document.querySelector('#user-message').value;
    nsSocket.emit('newMessageToServer', { text: newMessage });
}

function buildHTML(msg){
    const timestamp = new Date(msg.time).toLocaleTimeString();
    const messageLayout = `
    <li>
        <div class="user-image">
            <img src="${msg.avatar}" />
        </div>
        <div class="user-message">
            <div class="user-name-time">${msg.username}<span>${timestamp}</span></div>
            <div class="message-text">${msg.text}</div>
        </div>
    </li>`
    return messageLayout;
}