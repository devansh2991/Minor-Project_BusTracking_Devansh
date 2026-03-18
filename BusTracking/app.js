require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');

app.use(express.json());

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

app.use(express.static(path.join(__dirname, 'public')));
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

app.post("/test", (req, res) => {
  console.log("Received data:", req.body);

  res.json({
    message: "POST API working successfully",
    data: req.body,
  });
});

app.get('/', (req, res) => {
  res.render('index');
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");

    server.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch(err => console.error("DB Error:", err));