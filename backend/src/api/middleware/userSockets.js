const userSockets = {};
module.exports = {
    addUserSocket(userId, socketId) {
    console.log("I am here step 1")
      if(!userSockets[userId]){
        
        userSockets[userId] = new Set();
        console.log("I am here step 2")
      }
      console.log("I am here step 3")
      userSockets[userId].add(socketId);
      console.log(userSockets);
    },
    removeUserSocket(userId,socketId){
      if(userSockets[userId]){
        userSockets[userId].delete(socketId);
        if(userSockets[userId].size === 0){
          delete userSockets[userId];
        }
      }
      console.log(userSockets);
    },
    getUserSocket(userId){
      return userSockets[userId] || new set();
      console.log(userSockets);
    },
  }