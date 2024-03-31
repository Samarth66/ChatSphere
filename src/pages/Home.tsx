import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { socket } from "../components/socket";

const url = process.env.REACT_APP_BACKEND_URL;

interface Message {
  text: string;
}

function Home() {
  const [groupName, setGroupName] = useState("");
  const [createGroupName, setCreateGroupName] = useState("");
  const token = localStorage.getItem('token');
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Listen for new messages
    socket.on('newMessage', (message) => {
      console.log("gott ottt");
        setMessages(prevMessages => [...prevMessages, message]);
    });

    console.log(messages);

    // Clean up the event listener when the component unmounts
    return () => {
        socket.off('newMessage');
    };
}, []);

async function sendMessage() {
  if (!message.trim()) return; // Prevent sending empty messages

  try {
    const response = await axios.post(`${url}/addMessageToGroup`, {
      groupId: "660814a7d69d0333de38202e", // Ensure you have the correct groupId
      text: message,
    }, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(response)

    setMessage(""); // Clear message input after sending
  } catch (e) {
    console.error("Error sending message", e);
  }
}

function handleMessageChange(e: React.ChangeEvent<HTMLInputElement>) {
  setMessage(e.target.value);
}
  

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setGroupName(e.target.value);
  }

  function handleCreateGroupNameChange(e: React.ChangeEvent<HTMLInputElement>){
    setCreateGroupName(e.target.value);
    console.log(createGroupName);
  }

  async function joinGroup(): Promise<void> {
    try {
      const groupData = { groupId: groupName };
      const response = await axios.put(`${url}/joinGroup`, groupData, {
        headers:{ 'Authorization': `Bearer ${token}`}
      });
      console.log("Response from server:", response.data);
    } catch(e) {
      console.log("member not added to group", e);
    }
  }

  function createGroup() {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const groupData = {
            groupName: createGroupName, // Ensure groupName is set
            location: { latitude, longitude }
        };

        // Use an async IIFE inside the callback
        (async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve the token from local storage
                const response = await axios.post(`${url}/createGroup`, groupData, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                console.log("Response from server", response.data);
                // Additional logic after successful group creation
            } catch (e) {
                console.error("Create group failed", e);
            }
        })();
    }, (error) => {
        console.error("Error getting location", error);
    });
}


  return (
    <div className="p-4">
      <input 
        type="text" 
        onChange={handleOnChange} 
        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-blue-500" 
        placeholder="Enter group name" 
      />
      <button 
        onClick={joinGroup} 
        className="bg-blue-500 text-white rounded py-2 px-4 ml-2 hover:bg-blue-700"
      >
        Join Group
      </button>
      <input 
        type="text" 
        onChange={handleCreateGroupNameChange} 
        className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-blue-500" 
        placeholder="create group name" 
      />
      <button 
        onClick={createGroup} 
        className="bg-blue-500 text-white rounded py-2 px-4 ml-2 hover:bg-blue-700"
      >
        Create Group
      </button>
      
      <div>
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
          className="border border-gray-300 rounded py-2 px-4 focus:outline-none focus:border-blue-500"
          placeholder="Type a message"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white rounded py-2 px-4 ml-2 hover:bg-blue-700"
        >
          Send
        </button>
      </div>

      {/* Display messages */}
      <div>
        {messages.map((msg, index) => (
          <div key={index}>{msg.text}</div>
        ))}
      </div>

    </div>
  );
}

export default Home;
