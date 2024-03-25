const mongoose = require('mongoose');
const userModel= require('./users');

const groupSchema = new mongoose.Schema({
    name: String,
    description: String,
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true } 
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    members: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        }
    ],
});

groupSchema.index({ location: '2dsphere' });
const Group = mongoose.model('Group', groupSchema);
module.exports = Group;