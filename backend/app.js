require('dotenv').config();
const http=require('http');
const express = require('express');
const app = express();
const connectDB = require('./src/config/db');
const PORT = 8000;
const loginRoutes = require('./src/api/routes/loginRoutes');
const socket = require('./src/config/socket');
const jwt = require('jsonwebtoken');
const server = http.createServer(app);
const cors = require('cors');
const groupRoutes = require('./src/api/routes/groupRoutes')
const userSocketManagement = require('./src/api/middleware/userSockets');
const frontEndUrl= process.env.frontEndUrl
connectDB();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", 
    methods: ['GET', 'POST'] 
  }));
  
  
app.use('/',loginRoutes);
app.use('/',groupRoutes);
// const io = socketIo(server, {
//     cors: {
//       origin: frontEndUrl, // Ensure this matches your client URL
//       methods: ["GET", "POST"],
//       allowedHeaders: ["my-custom-header"],
//       credentials: true
//     }
//   });
  

// Initialize Socket.IO
const io = socket.initialize(server);
const userSockets = {};
io.on('connection', (socket) => {
  // socket.on('authenticate', (token) => {
      try {
          const token = socket.handshake.auth.token;
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const userId = decoded.user.id;
          userSocketManagement.addUserSocket(userId,socket.id);
          socket.on('disconnect', () => {
              console.log("disc");
              userSocketManagement.removeUserSocket(userId,socket.id);
          });
      } catch (error) {
          console.log("errr");
          socket.disconnect();
      }
  });
console.log(process.env.test);
server.listen(PORT, () => {
    io.on("connection", socket => {
      console.log("ok");
      console.log(socket.id);
      // io.in(roomID).emit()
      socket.emit("WELCOME_MESSAGE", ` ${socket.id} welcome!! `);
    });
  });