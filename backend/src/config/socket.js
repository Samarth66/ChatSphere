// socket.js
const socketIo = require('socket.io');
let io = null;

exports.initialize = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "http://localhost:3000", // Client URL
            methods: ["GET", "POST"]
        }
    });
    // Additional setup...
    return io;
};
