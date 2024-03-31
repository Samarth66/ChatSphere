import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { socket } from "./socket";
import { useNavigate } from 'react-router-dom';
import home from '../pages/Home';

const url = process.env.REACT_APP_BACKEND_URL;


interface userParams {
    email: string;
    password: string;
}



function LoginForm() {
    const [email, setEmail]= useState<string>('')
    const [password, setPassword] = useState<string>('') 
    
    const navigate = useNavigate();


    function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>){ 
        setEmail(e.target.value);
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
        console.log(password)
    }

    async function validate(e: React.FormEvent<HTMLFormElement>){
        try{
        e.preventDefault();
        if (!url) {
            console.error("URL is undefined");
            return;
        }
        const userData: userParams = {email, password};
        const response = await axios.post(`${url}/login`, userData);
        const token = response.data.token;
        localStorage.setItem('token', token);
        socket.auth  = {token};
        socket.connect();
        console.log("check check", socket.auth);
        navigate('/home');
        }
        catch(error){
            console.log("an error occured ", error);
        }
    }
    
  return (
    
    <div>
    <form  className='bg-white pd-10 mt' onSubmit={validate}>
        <div className='mb-6'>
        <div className="bg-white p-10 rounded shadow-lg" style={{ maxWidth: '400px' }}> 
        <label className='block mb-2 text-sm text-gray-600'>Email</label>
        <input type='email' className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500' id="email" value={email} onChange={handleEmailChange}/>
        <label className='block mb-2 text-sm text-gray-600'> password </label> 
        <input type='password' className='mb-2 w-full  rounded-md px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-600' value={password} onChange={handlePasswordChange}/>
        <button type='submit' className='w-full px-3 py-2 text-white bg-blue-600 rounded-md focus:bg-blue-700'>Submit</button>
        </div>
        </div>
    </form>
    </div>
  )
}

export default LoginForm