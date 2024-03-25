import React, { useState } from 'react'
import LoginForm from '../components/LoginForm'
import SignupForm from '../components/SignupForm'

function Login() {

    const [showSignup, setShowSignup] = useState<boolean>(false)

    function toggleForm(){
        setShowSignup(true);
    }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
        {!showSignup? (
           <>
        <LoginForm />
        <p>Dont have an account? <button onClick={toggleForm} className='text-blue-600 hover:underline'>Signup here</button></p>
        </>
        ):(
            <>
            <SignupForm />
            <p> Already Have an Account? <button onClick={()=>{
                setShowSignup(false);
            }} className='focus:underline text-blue-600'>Login here </button> </p>
            </>
        )

        }
    </div>
    
  )
}

export default Login