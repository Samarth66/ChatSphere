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
const userModel = require('./src/models/users');
const io = socket.initialize(server); 
const initializedIO = socket.getIO(); 
const messageRoutes = require('./src/api/routes/messageRoutes')


const frontEndUrl= process.env.frontEndUrl;
const redis = require('redis');
const client = redis.createClient({
    port: 6379 // default Redis port
});

connectDB();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", 
    methods: ['GET', 'POST','PUT','DELETE'] 
  }));
  
  
app.use('/',loginRoutes);
app.use('/',groupRoutes);
app.use('/',messageRoutes);
// const io = socketIo(server, {
//     cors: {
//       origin: frontEndUrl, // Ensure this matches your client URL
//       methods: ["GET", "POST"],
//       allowedHeaders: ["my-custom-header"],
//       credentials: true
//     }
//   });
// Initialize Socket.IO

const userSockets = {};
let activeSubscriptions = {};


initializedIO.on('connection', (socket) => {
  // socket.on('authenticate', (token) => {
      try {
          const token = socket.handshake.auth.token;
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const userId = decoded.user.id;
          userSocketManagement.addUserSocket(userId,socket.id);
          userModel.findById(userId).then(user =>{
            user.groups.forEach(groupId=>{
              console.log("joinin group, ",groupId);
              socket.join(groupId);
              if (io.sockets.adapter.rooms.has(groupId)) {
                const room = io.sockets.adapter.rooms.get(groupId);
                console.log(`Number of sockets in room '${groupId}': ${room.size}`, room);
              } else {
                console.log(`No such room: ${groupId}`);
              }
              if(!activeSubscriptions[groupId]){
                client.subscribe(groupId);
                console.log("connected to group", groupId);
                activeSubscriptions[groupId]=true
              }
         
            })

            });
          socket.on('disconnect', () => {
              console.log("user disconnected");
              handleDisconnect(socket, userId, io);
              
          });
      } catch (error) {
          console.log("errr");
          socket.disconnect();
      }
  });
  function handleDisconnect(socket, userId, io){
    userSocketManagement.removeUserSocket(userId,socket.id);
    userModel.findById(userId).then(user=>{
      const groups= user.groups;
      groups.forEach(groupId => {
        if(io.sockets.adapter.rooms.get(groupId)?.size===0){
          activeSubscriptions[groupId]=false;
          client.unsubscribe(groupId);
        }
      }
        )
      })
    }
console.log(process.env.test);
server.listen(PORT, () => {
  initializedIO.on("connection", socket => {
      console.log("ok");
      console.log(socket.id);
      // io.in(roomID).emit()
      socket.emit("WELCOME_MESSAGE", ` ${socket.id} welcome!! `);
    });
  }); 

