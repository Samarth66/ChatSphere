import React from 'react'
import { io } from 'socket.io-client';

const uri = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'; // Fallback to a default URL if undefined
console.log("urill",uri);
export const socket = io(uri, {
    autoConnect: false
});
