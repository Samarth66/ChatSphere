const mongoose = require('mongoose');
const groupSchema = require('./group');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    groups: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Group',
    }]
});

const userModel = mongoose.model('User', userSchema); 
module.exports = userModel;
