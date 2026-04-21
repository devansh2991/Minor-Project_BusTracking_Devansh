require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const { ReturnDocument } = require('mongodb');

app.use(cors());
app.use(express.json());


const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const busSchema = new mongoose.Schema({
  id: { type: String, primaryKey: true },
  busnumber: String,
  available: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  rollNo: { type: String, primaryKey: true },
  name: String,
  address: String,
});

const driverSchema = new mongoose.Schema({
  id: { type: String, primaryKey: true },
  mobile: String,
  name: String,
  available: { type: Boolean, default: false },
})

const routeSchema = new mongoose.Schema({
  id: {type: String, primaryKey: true},
  routeName: {type: String, required: true},
  stops: [{ type: String }],
})

 
const Route = mongoose.model('Route', routeSchema);

const Bus = mongoose.model('Bus', busSchema);

const Driver = mongoose.model('Driver', driverSchema);

const User = mongoose.model('User', userSchema);



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

// app.post("/test", (req, res) => {
//   console.log("Received data:", req.body);

//   res.json({
//     message: "POST API working successfully",
//     data: req.body,
//   });
// });

// Users APIs or Student APIs

app.post("/adduser", (req, res) => {
  console.log("Received user data:", req.body);
  const user = new User(req.body);
  user.save()
    .then(() => {
      res.json({
        message: "User added successfully",
        data: req.body,
      });
    })
    .catch((err) => {
      console.error("Error adding user:", err);
      res.status(500).json({
        message: "Error adding user",
        error: err,
      });
    });
});

app.get("/getusers", async (req, res) => {
  const users = await User.find();
  res.json({
    message: "Users retrieved successfully",
    data: users,
  });
});

app.get("/deleteuser/:id", async (req, res) => {
  const user = await User.findOneAndDelete({ _id: req.params.id });
  res.json({
    message: "User deleted successfully",
    data: user,
  });
});

app.get("/getuser", async (req, res) => {
  try{
    const { rollNo } = req.query;

    if (!rollNo) {
      return res.status(400).json({
        message: "rollNo query parameter is required",
      });
    }
    const user = await User.findOne({ rollNo: rollNo });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User found",
      data: user,
    });

  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Bus APIs

app.post("/addbus", (req, res) => {
  const bus = new Bus(req.body);
  bus.save()
    .then(() => {
      res.json({
        message: "Bus added successfully",
        data: req.body,
      });
    }
    )
    .catch((err) => {
      console.error("Error adding bus:", err);
      res.status(500).json({
        message: "Error adding bus",
        error: err,
      });
    });
});

app.get("/getbus", async (req, res) => {
  const { busnumber } = req.query;
  if (!busnumber) {
    return res.status(400).json({
      message: "busnumber query parameter is required",
    });
  }
  else {
    try {
      const bus = await Bus.findOne({ busnumber: busnumber });
      if (!bus) {
        return res.status(404).json({ message: "Bus not found" });
      }
      res.json({
        message: "Bus found",
        data: bus,
      });
    } catch (err) {
      console.error("Error fetching bus:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
});


app.get("/getbuses", async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json({
      message: "Buses retrieved successfully",
      data: buses,
    });
  } catch (err) {
    console.error("Error fetching buses:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/updatebus/:id", async (req, res) => {
  const { available } = req.body;
    const bus = await Bus.findByIdAndUpdate(req.params.id, { available }, { new: true, returnDocument: ReturnDocument.AFTER });
    res.json({
      message: "Bus updated successfully",
      data: bus,
    });
    console.log("Bus availability updated:", bus);
});


app.get("/deletebus/:id", async (req, res) => {
  const bus = await Bus.findOneAndDelete({ _id: req.params.id });
  res.json({
    message: "Bus deleted successfully",
    data: bus,
  });
});

// Route APIs
app.post("/addroute", async (req, res) => {
  const route = new Route(req.body); 
  route.save()
    .then(() => {
      res.json({
        message: "Route added Succesfully",
        data: req.body,
      });
    })
    .catch((err) => {
      console.error("Error adding Route", err)
      res.status(500).json({
        message: "Error adding Route",
        err: err,
      });
    });
}); 

app.get("/getroutes", async (req, res) => {
  const routes = await Route.find();
  res.json({
    message: "Routes retrieved successfully",
    data: routes,
  });
});

app.get("/deleteroute/:id", async (req, res) => {
  const route = await Route.findOneAndDelete({ _id: req.params.id });
  res.json({
    message: "Route deleted successfully",
    data: route,
  });
});

// Stop APIs

app.post("/addstop/:id", async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    route.stops.push(req.body.name);

    await route.save();

    res.json({
      message: "Stop added",
      data: route,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/deletestop/:id/:index", async (req, res) => {
  try {
    const { id, index } = req.params;

    const route = await Route.findById(id);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    route.stops.splice(index, 1);

    await route.save();

    res.json({
      message: "Stop removed",
      data: route,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Driver APIs

app.post("/adddriver", (req, res) => {
  const driver = new Driver(req.body);
  driver.save()
    .then(() => {
      res.json({
        message: "Driver added successfully",
        data: req.body,
      });
    })
    .catch((err) => {
      console.error("Error adding driver:", err);
      res.status(500).json({
        message: "Error adding driver",
        error: err,
      });
    });
});

app.get("/driver", async (req, res) => {
  const { name } = req.query; 
  if (!name) {
    return res.status(400).json({
      message: "name query parameter is required",
    });
  }
  else {
    const data = await Driver.findOne({ name: name });
    if (!data) {
      return res.status(404).json({ message: "Driver not found" });
    }
    else{
      return res.status(200).json({
      message: "Driver found",
      data: data,
    });
    }
  }
});

app.post("/updatedriver/:id", async (req, res) => {
  const { available } = req.body;
    const driver = await Driver.findByIdAndUpdate(req.params.id, { available }, { new: true, returnDocument: ReturnDocument.AFTER });
    res.json({
      message: "Driver updated successfully",
      data: driver,
    });
});


app.get("/getdrivers", async (req, res) => {
  const drivers = await Driver.find();
  res.json({
    message: "Drivers retrieved successfully",
    data: drivers,
  });
});

app.get("/deletedriver/:id", async (req, res) => {
  const driver = await Driver.findOneAndDelete({ _id: req.params.id });
  res.json({
    message: "Driver deleted successfully",
    data: driver,
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