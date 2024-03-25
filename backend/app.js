require('dotenv').config();
const http=require('http');
const express = require('express');
const app = express();
const connectDB = require('./src/config/db');
const PORT = 8000;
const loginRoutes = require('./src/api/routes/loginRoutes');
const socketIo = require('socket.io');
const server = http.createServer(app);
const cors = require('cors');
const groupRoutes = require('./src/api/routes/groupRoutes')
const frontEndUrl= process.env.frontEndUrl
connectDB();
app.use(express.json());
app.use(cors({
    origin: frontEndUrl, 
    methods: ['GET', 'POST'] 
  }));
  
  
app.use('/',loginRoutes);
app.use('/',groupRoutes);
const io = socketIo(server, {
    cors: {
      origin: frontEndUrl, // Ensure this matches your client URL
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });
  
io.on('connect', (socket)=>{
    console.log("Server is connected", socket.id);

    socket.on('sendMessage', (message)=>{
        io.emit('message', message);
    });

    socket.on('disconnect', ()=>{
        console.log('Client disconnected');
    })
})


console.log(process.env.test);
server.listen(PORT, () => {
    io.on("connection", socket => {
      console.log("ok");
      console.log(socket.id);
      // io.in(roomID).emit()
      socket.emit("WELCOME_MESSAGE", ` ${socket.id} welcome!! `);
    });
  });

