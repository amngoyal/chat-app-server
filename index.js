const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');

const { addUsers, removeUsers, getUser, getUsersInRoom } = require('./users')

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
    console.log("We have a new connection!!!");

    socket.on('join', ({ name, room }, callback) => {

        const { user, error } = addUsers({ id: socket.id, name, room });

        console.log(user);

        if (error) callback(error);

        socket.join(user.room);

        socket.emit('message', { user: 'admin', text: `${user.name}, Welcome to the room ${user.room}.` });
        socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined` });

        io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

        callback();
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('message', { user: user.name, text: message });

        callback();
    })

    socket.on('disconnect', () => {
        console.log("user had left");
        const user = removeUsers(socket.id);
        if (user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        }
    })
})

app.use(router);
app.use(cors());

server.listen(PORT, () => { console.log(`Server is running at port ${PORT}`); })


