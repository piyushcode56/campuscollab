import React from 'react'
import { Link } from 'react-router-dom'
import { Outlet } from 'react-router-dom'
import './AdminPage.css';
import image from '../assets/adminImage.png'
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const AdminPage = ({admin}) => {

  
  const location = useLocation();
  return (
    <div className="admin-page">
        <div className="admin-dashboard">
        {
          admin 
          ?
          <div className="admin-section">
            <Link to={'/admin'}><img src={admin.avatar} alt="" /></Link>
            <h2>{admin.name}</h2>
            <p>{admin.email}</p>
            <hr />
            <div className="dashboard">
            <Link to={'/admin/dashboard'}><a href="/admin/dashboard">Dashboard</a></Link>
            <Link to={'/admin/dashboard'}><i class='fa-solid fa-arrow-right'></i></Link>
            </div>
            <div className="all-users">

            <Link to={'/admin/users'}><a href="/admin/users">All Users</a></Link>
            <Link to={'/admin/users'}><i class='fa-solid fa-arrow-right'></i></Link>
            </div>
            <div className="all-projects">
            <Link to={'/admin/allprojects'}><a href="/admin/allprojects">All Projects</a></Link>
            <Link to={'/admin/allprojects'}><i class='fa-solid fa-arrow-right'></i></Link>
            </div>
            

          </div>
          :
          <h1>No admin</h1>
        }
        </div>
      
        <div className="admin-main-content">
          {
            location.pathname === '/admin'
            ?
            <div className="admin-image">
              <img src={image} alt="" />
            </div>
            :
          <Outlet/>
        }
        </div>
      </div>
  )
}

export default AdminPage
