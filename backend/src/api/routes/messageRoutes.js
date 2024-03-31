const express = require('express');
const Group = require('../../models/group');
const userModel = require('../../models/users');
const Message = require('../../models/messages');
const validate = require('../middleware/authorization');
const router = express.Router();
const socket= require('../../config/socket');


router.get('/displayMessage', validate, async (req,res)=>{
    
    const {groupId, pageNumber, pageSize} = req.body;

    try{
        const messages = await Message.find({ groupId: groupId })
        .skip(pageNumber * pageSize)
        .limit(pageSize)
        .sort({ createdAt: -1 });

        return res.status(200).json(messages);
    }
    catch(error){
        return res.status(500).json({ message: `Server error: ${error.message}` });
    }

} )

router.post('/addMessageToGroup', validate, async (req,res)=> {

    const userId = req.userId;
    const {groupId, text} = req.body;
    const newMessage = new Message({
        groupId: groupId,
        sender: userId,
        text:text
    });
    
    try{
        
        await newMessage.save();
        
        const io = socket.getIO(); 
        if (io.sockets.adapter.rooms.has(groupId)) {
            const room = io.sockets.adapter.rooms.get(groupId);
            console.log(`Sockets in room '${groupId}':`);
            room.forEach(socketId => {
                console.log(socketId);
            });
        } else {
            console.log(`No such room: ${groupId}`);
        }
        io.in(groupId).emit('newMessage', { message: newMessage });
        if (io.sockets.adapter.rooms.has(groupId)) {
            const room = io.sockets.adapter.rooms.get(groupId);
            console.log(`Number of sockets in room '${room}': ${room.size}`, room);
          } else {
            console.log(`No such room: ${groupId}`);
          }
        console.log(newMessage,"message recieved");
        
        return res.status(201).json({ message: newMessage});
    }
    catch(error){
        return res.status(500).json({message:`Server error ${error.message}`});
    }
})

module.exports = router;