import React from 'react'
import MyProject from './MyProject'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './ParticularUserProject.css';
const ParticularUserProject = ({projects, users}) => {
    const [userDetails, setUserDetails] = useState([]);
    const {userid} = useParams();
    function fetchUsername(){
        const filteredUserName = Array.isArray(users) ? users.filter((user) => user._id === userid):[];
        setUserDetails(filteredUserName[0]);
    }
    useEffect(() => {
        fetchUsername();
    },[userid, users])

  return (
    <div className='particular-user-project-section'>   
        {
            userDetails
            ?
            <div className="users">
                <h4>Username: <strong>{userDetails.username}</strong></h4>
                <h4>Email: <strong>{userDetails.email}</strong></h4>
                <MyProject/>
            </div>
            :
            <h1>No projects</h1>
        }
    </div>
  )
}

export default ParticularUserProject
