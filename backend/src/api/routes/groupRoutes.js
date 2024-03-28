const express = require('express');
const router = express.Router(); 
const validate = require('../middleware/authorization');
const Group = require('../../models/group');
const User = require('../../models/users');

router.post('/createGroup', validate, async (req, res) => {
    console.log(req.body); 
    const newGroup = req.body;
    const groupDocument = new Group(newGroup);

    groupDocument.save()
        .then(group => {
            const userId = req.userId; // Ensure this correctly gets the userId
            console.log(userId);

            return User.findByIdAndUpdate(userId, 
                { $addToSet: { groups: group._id } }, 
                { new: true }
            );
        })
        .then(updatedUser => {
            // Only send the response after updating the user
            console.log(updatedUser);
            res.status(201).json(updatedUser); // or send 'group' if preferred
        })
        .catch(err => {
            // Catch any error from both group creation and user update
            console.error(err);
            res.status(500).json({ message: err.message });
        });
}
);




router.get('/getGroup', validate, async (req,res)=>{
    console.log(req.body);
    const {long, lat} = req.body
    Group.find({
        location: { $nearSphere: { $geometry: {
            type: "Point",
            coordinates: [long,lat]},
            $maxDistance:2000
        }}
    }).then(groups=>{
        console.log("groups within 2 km are:", groups);
        res.status(201).json({groups: groups});
    }).catch(err=>{
        console.log(err)
    })
    
})

router.put('/joinGroup', validate, async (req,res) =>{
    const userId = req.userId;
    const {groupId} = req.body;
    
    try{
    await Group.findByIdAndUpdate(groupId, {$addToSet: {members: userId}});
    await User.findByIdAndUpdate(userId, {$addToSet: {groups: groupId}});
    return res.status(200).json({message:"user successfully joined the group"});
    }
    catch(e){
        return res.status(500).json({ message: `Internal server error: ${e.message}` });
    }
})


module.exports = router;

