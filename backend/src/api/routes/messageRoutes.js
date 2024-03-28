const express = require('express');
const Group = require('../../models/group');
const userModel = require('../../models/users');
const Message = require('../../models/messages');
const validate = require('../middleware/authorization');
const router = express.Router();



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
    const {groupId, senderId, text} = req.body;
    const newMessage = new Message({
        groupId: groupId,
        sender: senderId,
        text:text
    });
    try{
        await newMessage.save();
        return res.status(201).json({ message: "Message added successfully" });
    }
    catch(error){
        return res.status(500).json({message:`Server error ${error.message}`});
    }
})
