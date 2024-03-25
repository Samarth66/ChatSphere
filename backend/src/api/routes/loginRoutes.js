const userModel = require('../../models/users');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    try{
    console.log("login", req.body);
    const {email, password} = req.body;

    const user =  await userModel.findOne({email:email});

    if(!user){
        return res.status(401).json({message:"User doesn't exists"});
    }
    
    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch)
    {
    return res.status(401).json({message:"Please enter correct password"});
    }

    const payload = {
        user: {
            id: user._id
        }
    };

    jwt.sign(payload, process.env.JWT_SECRET, (err,token)=>{
    if(err){
        console.log(err);
        return res.status(500).json({message:"error in generating token"});
    }
    return res.json({token});
})

}
catch(e){
    console.log(e);
    res.status(500).json({message:"Server error"}); 
}   
})



router.post('/signup',async (req, res)=>{
try{
    const {name, email, password} = req.body;
    const existingUser = await userModel.findOne({email:email});
    if (existingUser){
        return res.status(400).json({message:"User already exists"});
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
        name,
        email,
        password: hashedPassword,
    });

    await newUser.save();

    //user added successfully 
    res.status(201).json({message: "user created successfully"});
}
catch(e){
    console.log(e);
    return res.status(500).json({message:"server error"});
}
})

module.exports = router;
