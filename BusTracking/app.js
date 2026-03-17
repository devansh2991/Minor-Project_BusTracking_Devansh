const express = require('express');
const app = express();
const socketIo = require('socket.io');
const http = require('http');
const path = require('path');

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// static files
app.use(express.static(path.join(__dirname, 'public')));

// ejs
app.set('view engine', 'ejs');

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('locationUpdate', (data) => {
        io.emit('receiveLocation', {
            id: socket.id,
            ...data
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        io.emit('userDisconnected', socket.id);
    });
});

app.get('/', (req, res) => {
    res.render('index');
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});