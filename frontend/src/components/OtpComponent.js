import React, { useEffect } from 'react'
import { useState } from 'react';
import './OtpComponent.css';
import { handleError, handleSuccess } from '../Utils';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const OtpComponent = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [otpText, setOtpText] = useState('Otp is sent successfully to your email');
    const [email, setEmail] = useState();

    async function handleOtpSubmit(e){
        e.preventDefault();
        console.log(otp);
        // const formData = new FormData();
        try{
            // formData.append('otp', otp)
            const url = 'http://localhost:8000/user/verifyotp';
            const response = await fetch(url, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({otp})
            })
            const result = await response.json();
            const {error, success} = result;

            if(success){
                setTimeout(() => {
                    handleSuccess(success);
                    setOtp('');
                },1000)
                setTimeout(()=>{
                    navigate('/login')
                },2000)

            }
            if(error){
                handleError(error)
            }
        }
        catch(error){
            console.log(error);
        }
    }

    const handleEmailSubmit = async(e) => {
        e.preventDefault();

        try{
            const url = 'http://localhost:8000/user/resetpasswordotp';
            const response = await fetch(url, {
                method:'POST',
                headers:{
                    'Content-Type' : 'application/json'
                },
                body:JSON.stringify({email})
            })

            const result = await response.json();
            const {success, error} = result;

            if(success){
                handleSuccess(success)
                setTimeout(() => {
                    navigate('/user/resetpassword')
                }, 2000)
            }
            if(error){
                handleError(error)
            }
        }
        catch(error){
            console.log(error);
        }
        
    }


    setTimeout(() => {
        setOtpText('')
    },3000)
  return (
    <div className='otp-page'>
        
      {
        location.pathname === '/user/verifyotp'
        ?
        <div>
            <h3>{otpText}</h3> 
        <form action="" className='otp-form' onSubmit={(e)=>handleOtpSubmit(e)}>
            <input type="text" name='otp' placeholder='Enter Otp' value={otp} required onChange={(e)=>setOtp(e.target.value)}/>
            <button type='submit'>Submit</button>
      </form>
        </div>
      :
      location.pathname === '/user/resetpasswordotp' ?
      <form action="" className='otp-form' onSubmit={(e)=>handleEmailSubmit(e)}>
            <input type="email" name='email' placeholder='Enter your registered email' value={email} required onChange={(e)=>setEmail(e.target.value)}/>
            <button type='submit'>Submit</button>
      </form>
      :
      ''
      }
      <ToastContainer position='top-center' theme='dark'/>
    </div>
  )
}

export default OtpComponent
