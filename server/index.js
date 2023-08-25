const express = require('express');
const app = express();
const PORT = 3001;
const http = require('http').Server(app)
const cors = require('cors');
const socketIO = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

app.get(`/api`, (req, res) => {
    res.json({
        message: 'Hi people'
    })
})

const users = [];

socketIO.on('connection', (socket) => {
    console.log(`${socket.id} user connected`);
    socket.on('message', (data) => {
        socketIO.emit('response', data)
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('responseTyping', data)
    })

    socket.on('newUser', (data) => {
        users.push(data)
        socketIO.emit('responseNewUser', users)
    })
    socket.on('disconnect', () => {

        console.log(`${socket.id} user ушел`);
    })
})

http.listen(PORT, () => console.log(`server is running on port ${PORT}`))

