import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
// import { useEffect } from 'react'
import { useContext } from 'react'
import { StoreContext } from '../../context/StoreContext'
import axios from "axios";

const LoginPopup = ({setShowLoginPopup}) => {

    const { url, setToken }= useContext(StoreContext)

    const [currState, setCurrState] = useState("Login ")
    const [data, setData] = useState({
        name:"",
        email:"",
        password:"",
    })

    const onChangeHandler = (event)=>{
        const name = event.target.name;
        const value = event.target.value;

        setData( data=>({...data, [name]:value}) )
    }

    const onLogin = async (event)=>{
        // console.log("formSubmitted")
        event.preventDefault();

        let newUrl = url;
        if (currState === "Signup") {
            newUrl += "/api/user/register";
        }else{
            newUrl += "/api/user/login"
        }

        const response = await axios.post(newUrl, data);
        if (response.data.success) {
            // console.log(typeof(response.data.token));
            setToken(response.data.token);
            localStorage.setItem('token', response.data.token);
            setShowLoginPopup(false)
        }else{
            alert(response.data.message)
        }
    }

    // useEffect(()=>{
    //     console.log(data);        
    // }, [data])

  return (
    <div className='login-popup'>
        <form onSubmit={onLogin} className="login-popup-container">
            <div className="login-popup-tital">
                <h2>{currState}</h2>
                <img onClick={()=>setShowLoginPopup(false)} src={assets.cross_icon} />
            </div>
            <div className="login-popup-inputs">
                {currState==="Signup"?<input name="name" onChange={onChangeHandler} value={data.name} type="text" placeholder='Full Name' required />:<></>}                
                <input name="email" onChange={onChangeHandler} value={data.email} type="email" placeholder='Email' required/>
                <input name="password" onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
            </div>
            <button type='submit' >{currState==="Signup"?"Create Account":"Login"}</button>
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

