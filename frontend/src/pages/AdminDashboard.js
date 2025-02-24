import React from 'react'
import './AdminDashboard.css';
import { Link } from 'react-router-dom';
import projectImage from '../assets/projectImage.png';
import { useEffect } from 'react';

const AdminDashboard = ({users, projects}) => {
    
  return (
    <div className='dashboard-page'>
      <div className="total-users">
        
      {
        !users
        ?
        <div className="loading">
        </div>
        :
        users
        ?
        <Link to={'/admin/users'}>
            <div className="users-website">
            <img src='https://www.tech101.in/wp-content/uploads/2019/07/software-users.png' alt="" />
            <div className="users-details">
            <h2>Total Users: <strong>{users.length}</strong></h2>
            <Link to={'/admin/users'}>See more...</Link>
            </div>
        </div>
        </Link>
        :
        <h1>Total users: <strong>0</strong></h1>
        
      }
      </div>
      <div className="total-projects">
        {
            projects
            ?
            <Link to={'/admin/allprojects'}>
                <div className="projects-website">
                <img src={projectImage} alt="" />
                <div className="projects-details">
                <h2>Total Projects: <strong>{projects.length}</strong></h2>
                <Link to={'/admin/allprojects'}>See more...</Link>
                </div>
            </div>
            </Link>
            :
            <h1>Total Projects: <strong>0</strong></h1>
        }
      </div>
    </div>
  )
}

export default AdminDashboard
