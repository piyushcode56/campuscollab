import React from 'react'
import ParticularUserProjects from './ParticularUserProjects.js'
import './UserBasedProjects.css';
const UserBasedProjects = ({projects}) => {
    // console.log(projects);
  return (
    <div className='user-based-projects'>
        
        {
            projects
            ?
            <ParticularUserProjects projects={projects}/>
            :
            <h2>User doesn't have any projects</h2>
        }
    </div>
  )
}

export default UserBasedProjects
