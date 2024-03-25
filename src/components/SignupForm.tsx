import React, { useState } from 'react'

function SignupForm() {
    const [email, setEmail]= useState<string>('')
    const [password, setPassword] = useState<string>('') 
    function handleEmailChange(e: React.ChangeEvent<HTMLInputElement>){ 
        setEmail(e.target.value);
    }

    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
        console.log(password)
    }
  return (
    
    <div>
    <form  className='bg-white pd-10 mt' >
        <div className='mb-6'>
        <div className="bg-white p-10 rounded shadow-lg" style={{ maxWidth: '400px' }}> 
        <label className='block mb-2 text-sm text-gray-600'>Name</label>
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

export default SignupForm