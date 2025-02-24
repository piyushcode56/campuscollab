import React from 'react'
import { Link } from 'react-router-dom';
import signupimage from '../assets/signupimage.jpg';
import { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { handleSuccess, handleError } from '../Utils';
import { ToastContainer } from 'react-toastify';
const Login = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        username:'',
        password:'',
        role:''
    })

    const handleLoginData = (e) => {
        const {name, value} = e.target;

        setLoginData((prevData) => ({
            ...prevData,
            [name]:value
        }))
    }

    const handleLoginForm = async(e) => {
        
        e.preventDefault();

        try{
            const url = 'http://localhost:8000/user/login';
            const response = await fetch(url, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(loginData)
            })

            const result = await response.json();
            console.log(result);
            const {message, error, success, jwtToken, id, username, role, email} = result;
            console.log(role);
            if(success){
                handleSuccess(success);
                localStorage.setItem('token', jwtToken);
                localStorage.setItem('username', username);
                localStorage.setItem('userId', id);
                localStorage.setItem('userRole', role);
                localStorage.setItem('userEmail', email);
                setLoginData({
                    username:'',
                    password:''
                })
                if(role === "admin"){
                    return setTimeout(() => {
     
                        navigate('/admin')
                    },2000)
                }
                
                
                setTimeout(() => {
                    navigate('/')
                }, 2000)
            }

            if(message){
                handleError(message)
            }
            if(error){
                handleError(error)
            }
        }
        catch(error){
            console.log(error);
        }
    }


  return (
    <div>
        <div className='login-page'>
        
        <div className="login-page-image">
            <img src={signupimage} alt="" />
        </div>
        <form action="" className='login-form' onSubmit={handleLoginForm}>
        <h1>Login</h1>

      <input type="text" id="username" name="username" placeholder="Enter username" value={loginData.username} required onChange={handleLoginData}/>
      <select name="role" id="" onChange={handleLoginData} value={loginData.role}>
        <option value="">Select Role</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
     
      <input type="password" id="password" name="password" placeholder="Enter Password" value={loginData.password} required onChange={handleLoginData}/>
      <button type="submit">Login</button>
      <p>New User ? <Link to={'/signup'}><a href="/signup">Signup</a></Link></p>
      <p>Forgot password ? <Link to={'/user/resetpasswordotp'}><a href="">Click here</a></Link></p>
        </form>
    </div>
    <ToastContainer position='top-right' theme='dark'/>
    </div>
  )
}

export default Login
