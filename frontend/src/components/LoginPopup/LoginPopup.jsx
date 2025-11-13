import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'

const LoginPopup = ({setShowLoginPopup}) => {

    const [currState, setCurrState] = useState("Login ")

  return (
    <div className='login-popup'>
        <form className="login-popup-container">
            <div className="login-popup-tital">
                <h2>{currState}</h2>
                <img onClick={()=>setShowLoginPopup(false)} src={assets.cross_icon} />
            </div>
            <div className="login-popup-inputs">
                {currState==="Signup"?<input type="text" placeholder='Full Name' required />:<></>}                
                <input type="email" placeholder='Email' required/>
                <input type="password" placeholder='Password' required />
            </div>
            <button>{currState==="Signup"?"Create Account":"Login"}</button>
            <div className="login-popup-condition">
                <input type="checkbox" required />
                <p>By continuing, I agree to the term of use & Privacy Policy.</p>
            </div>
            <div className="span">
                {currState==="Signup"?<p>Already have an account?<span onClick={()=>{setCurrState("Login")}} >Login here</span> </p>:<p>Create new account <span onClick={()=>{setCurrState("Signup")}} >click here</span> </p>}
            </div>
        </form>
    </div>
  )
}

export default LoginPopup

