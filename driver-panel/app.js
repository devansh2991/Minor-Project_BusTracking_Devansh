const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const http = require("http");
const path = require("path");
require("dotenv").config();

const server = http.createServer(app);
app.use(cors());
app.use(express.json());

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

app.get('/', (req, res) => {
  res.render('index');
});

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");

    server.listen(8000, () => {
      console.log("Server running on port 8000");
    });
  })
  .catch(err => console.error("DB Error:", err));