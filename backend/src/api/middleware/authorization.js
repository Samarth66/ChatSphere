require('dotenv').config();
const jwt = require('jsonwebtoken');
const validateTokenMiddleware = (req,res,next) =>{

    const token = req.headers.authorization?.split(' ')[1];
    
    if(!token) {
        return res.status(401).json({message: "No Token provided"});
    }

    try{
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decode",decode.user.id);
    req.userId= decode.user.id;
    next();

}
catch(e){
    return res.status(401).json({message:"Invalid token"});
}
}
module.exports = validateTokenMiddleware;