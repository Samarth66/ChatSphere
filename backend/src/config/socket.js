const socketIo = require('socket.io');
let io;

exports.initialize = (server) => {
    io = socketIo(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });
    return io;
};

exports.getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
