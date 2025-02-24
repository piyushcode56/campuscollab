import React from 'react'
import './App.css';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Signup from './components/Signup';
import Login from './components/Login';
import AdminPage from './pages/AdminPage';
import MyProjects from './pages/MyProjects';
import AddProject from './pages/AddProject';
import MyProject from './pages/MyProject';
import { useState, useEffect } from 'react';
import AllUser from './pages/AllUser';
import AllProject from './pages/AllProject';
import AdminDashboard from './pages/AdminDashboard';
// import AdminUserProjects from './pages/ParticularUserProjects';
import DynamicTitle from './components/DynamicTitle';
import ParticularUserProject from './pages/ParticularUserProject';
import SearchUser from './pages/SearchUser';
import ParticularUserProjects from './pages/ParticularUserProjects';
import UserBasedProjects from './pages/UserBasedProjects';
import UserBasedProject from './pages/UserBasedProject';
import OtpComponent from './components/OtpComponent';
import ResetPassword from './components/ResetPassword';
import EditProject from './pages/EditProject';
import Favourites from './pages/Favourites';
import Footer from './components/Footer';
import FavouriteProject from './pages/FavouriteProject';
const App = () => {
  const [admin, setAdmin] = useState();
  const Id = localStorage.getItem('userId');
  const [users, setUsers] = useState();
  const [projects, setProjects] = useState();
  const [userProjects, setUserProjects] = useState();
  async function fetchAdmin() {
    try{
      const url = 'http://localhost:8000/user/admin/users';
      const response = await fetch(url, {
        method:'GET',
        headers:{
          'Authorization':localStorage.getItem('token')
        },
        
      })
      const result = await response.json();
      const filteredUsers = result.users.filter((user) => user.role !== 'admin');
      setUsers(filteredUsers);
      const filteredAdmin = result.users.filter((user) => user.role === 'admin');
      const adminDetails = filteredAdmin.filter((adminDetails) => adminDetails._id === Id)
      setAdmin(adminDetails[0])
    }
    catch(error){
      console.log(error);
    }
  }

  async function fetchProjects(){
    try{
      const url = 'http://localhost:8000/projects/allprojects';
      const response = await fetch(url, {
        method:'GET',
        headers:{
          'Authorization':localStorage.getItem('token')
        }
      })
      const result = await response.json();
      setProjects(result.projects);

      const filteredProjects = result.projects.filter((userResult) => userResult.user === Id);
      console.log(filteredProjects);
      setUserProjects(filteredProjects);
      
    }
    catch(error){
      console.log(error);
    }
  }
  useEffect(() => {

    fetchAdmin();
  }, [Id]);

  useEffect(() => {
    fetchAdmin();
  },[])

  useEffect(() => {
    fetchProjects();
  },[])

  return (
    <div>
      <Navbar/>
      <DynamicTitle/>
      <Routes>
        
        <Route path='/' element={<HomePage users={users}/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/myprojects' element={<MyProjects/>}/>
        <Route path='/addprojects' element={<AddProject/>}/>
        <Route path='/project/:projectid' element={<MyProject/>}/>
        <Route path='/campuscollab/search' element={<SearchUser users={users}/>}/>
        <Route path='/:userid/projects' element={<UserBasedProjects projects={projects} users={users}/>}/>
        <Route path='/user/verifyotp' element={<OtpComponent/>}/>
        <Route path='/user/resetpasswordotp' element={<OtpComponent/>}/>
        <Route path='/user/resetpassword' element={<ResetPassword/>}/>
        <Route path='/edit/project/:projectId' element={<EditProject/>}/>
        <Route path='/:userid/:projectid' element={<UserBasedProject projects={projects} users={users}/>}/>
        <Route path='/favourites' element={<Favourites/>}/>
        <Route path = '/project/favourite/:projectid' element={<FavouriteProject/>}/>
        <Route path='/admin' element={<AdminPage admin={admin}/>}>
          <Route path='users' element={<AllUser users={users}/>}/>
          <Route path='allprojects' element={<AllProject projects={projects} users={users}/>}/>
          <Route path='dashboard' element={<AdminDashboard users={users} projects={projects}/>}/>
          <Route path='/admin/:userid/projects' element={<ParticularUserProjects projects={projects} users={users}/>}/>
          <Route path='/admin/:userid/project/:projectid' element={<ParticularUserProject projects={projects} users={users}/>}/>
        </Route>
      </Routes>
      <Footer/>
    
    </div>
  )
}

export default App

