import React from 'react'
import './ResetPassword.css';
import { useState } from 'react';
import { handleError, handleSuccess } from '../Utils';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
const ResetPassword = () => {
    const navigate = useNavigate();
    const [resetPasswordData, setResetPasswordData] = useState({
        otp:'',
        username:'',
        password:''
    })

    const handleResetData = (e)=> {
        const {name, value} = e.target;
        setResetPasswordData((prevData) => ({
            ...prevData,
            [name] : value
        }))
    }
    const handleResetFormSubmit = async(e) => {
        e.preventDefault();
    
        try{
            const url = 'http://localhost:8000/user/resetpassword';
            const response = await fetch(url, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(resetPasswordData)
            })
            const result = await response.json();
            const {error, success} = result;

            if(success){
                handleSuccess(success);
                setResetPasswordData({
                    otp:'',
                    username:'',
                    password:''
                })
                setTimeout(() => {
                    navigate('/login')
                },2000)
            }

            if(error){
                handleError(error);
            }
        }
        catch(error){
            console.log(error);
        }
    }
    console.log(resetPasswordData);
  return (
    <div className='reset-password-page'>
        <h2 style={{marginBottom:'20px'}}>Reset Password</h2>
        <form action="" className='reset-password-form' onSubmit={handleResetFormSubmit}>
            <div className="otp">
                <label htmlFor="">OTP</label>
                <input type="text" name='otp' placeholder='Enter otp' required onChange={handleResetData} value={resetPasswordData.otp}/>
            </div>
            <div className="username">
                <label htmlFor="">Username</label>
                <input type="text" name='username' placeholder='Enter your username' required onChange={handleResetData} value={resetPasswordData.username}/>
            </div>

            <div className="password">
                <label htmlFor="">Password</label>
                <input type="password" name='password' placeholder='Create new password' required onChange={handleResetData} value={resetPasswordData.password}/>
            </div> 


            <button type='submit'>Submit</button>  
        </form>
        <ToastContainer position='top-center' theme='dark'/>
    </div>
  )
}

export default ResetPassword
