import React from 'react'
// import avatar from '../assets/avatar2.png';
import signupimage from '../assets/signupimage.jpg'
import './Signup.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { handleSuccess, handleError } from '../Utils';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
    const navigate = useNavigate();
    const [signupData, setSignupData] = useState({
        name:'',
        username:'',
        email:'',
        password:'',
        role:''
    })

    const handleSignupData = (e) => {
        const {name, value} = e.target;
    
        setSignupData((prevData)=>({
            ...prevData,
            [name]:value
        }))
    }

    console.log(signupData);
    const handleSignupForm = async(e) => {
        e.preventDefault();

        try{
            const url = 'http://localhost:8000/user/signup';
            const response = await fetch(url, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(signupData)
            })
            const result = await response.json();
            console.log(result);
            const {success, error, message} = result;
            if(success){
                handleSuccess(success);
                setSignupData({
                    name:'',
                    username:'',
                    email:'',
                    password:''
                })
                setTimeout(()=>{
                    navigate('/user/verifyotp');
                }, 2000)

            }
            if(error){
                handleError(error)
            }
            if(message){
                handleError(message);
            }
        }
        catch(error){
            console.log('error', error)
        }
    }

  return (
    <div>
        <div className="signup-page">
        <div className="signup-page-image">
            <img src={signupimage} alt="" />
        </div>
        <form action="" className='signup-form' onSubmit={handleSignupForm}>
        <h1>Signup</h1>
       
      <input type="text" id="name" name="name" placeholder="Enter your name" value={signupData.name} required onChange={handleSignupData}/>

      <input type="text" id="username" name="username" placeholder="Choose a username" value={signupData.username} required onChange={handleSignupData}/>

      <select name='role' id="" onChange={handleSignupData} value={signupData.role}>
        <option value="">Select Role</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
     
      <input type="email" id="email" name="email" placeholder="Enter your email" value={signupData.email} required onChange={handleSignupData}/>
     
      <input type="password" id="password" name="password" placeholder="Create a password" required value={signupData.password} onChange={handleSignupData}/>
      <button type="submit">Signup</button>
      <p>Already have an account ? <Link to={'/login'}><a href="/login">Login</a></Link></p>
        </form>
        </div>
    <ToastContainer theme='dark' className={'toastcontainer'}/>
    </div>
    
  )
}

export default Signup
