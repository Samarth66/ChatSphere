const mongoose = require('mongoose');
const Group = require('./group');
const User  = require('./users');
const messageSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group', // Use the model name as a string
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Use the model name as a string
        required: true
    },
    text: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', messageSchema); // Correct the method name to model
module.exports = Message;
