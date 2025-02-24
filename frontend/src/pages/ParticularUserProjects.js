import React from 'react'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './ParticularUserProjects.css';
const ParticularUserProjects = ({projects, users}) => {
    const location = useLocation();
    const {userid} = useParams();
    const [filteredProjects, setFilteredProjects] = useState();
    const [searchQuery, setSearchQuery] = useState();

    function handleSearch(){
        const userFilteredProjects = projects && projects.filter((project) => (
            project.user === userid ?
            project.name.toLowerCase().includes(searchQuery.toLowerCase())
            :
            'sorry no data available'
        ))
        setFilteredProjects(userFilteredProjects);
    }
    const selectSearchFilter = (e) => {
        const userFilteredProjects = projects && projects.filter((project) => (
            project.domain.toLowerCase().includes(e.toLowerCase())
        ))
        setFilteredProjects(userFilteredProjects)
    }

  return (
    <div class='all-users-projects-page'>
        <div className="search-user-projects">
            <input type="text" placeholder='Search projects' onChange={(e)=>setSearchQuery(e.target.value)}/>
            <button onClick={handleSearch}><i class='fa-solid fa-search'></i></button>
        </div>
    <div className="search-projects-domain-filter">
    <select name="" id=""  onClick={(e)=>selectSearchFilter(e.target.value)}>
            <option value="">Filter Domain</option>
            <option value="software project">Software Projects</option>
            <option value="hardware project">Hardware Projects</option>
            <option value="Both(Software and Hardware)">Both(Software and Hardware)</option>
            <option value="others">Others</option>
        </select>
    </div>
      <div className="userid-based-projects">

        { 
       
            projects
            ?
            filteredProjects
            ?
            filteredProjects.map((project) => {
                
                if(project.user === userid){
                    if(location.pathname === `/admin/${userid}/projects`){
                        return <Link to={`/admin/${userid}/project/${project._id}`}>
                            <div className="all-users-projects">
                            <h3>Project Name: <strong>{project.name}</strong></h3>
                            <h3>Upload date: <strong>{project.uploadDate.slice(0,10)}</strong></h3>
                            <Link><i class='fa fa-trash'></i></Link>
                        </div>
                        </Link>
                    }
                    else{
                        return <Link to={`/${userid}/${project._id}`}>
                            <div className="all-users-projects">
                            <h3>Project Name: <strong>{project.name}</strong></h3>
                            <h3>Project domain: <strong>{project.domain}</strong></h3>
                            <h3>Upload date: <strong>{project.uploadDate.slice(0,10)}</strong></h3>
                        </div>
                        </Link>
                    }
                }
                
            })
            :

            projects.map((project) => {
                if(project.user === userid){
                    if(location.pathname === `/admin/${userid}/projects`){
                        return <Link to={`/admin/${userid}/project/${project._id}`}>
                            <div className="all-users-projects">
                            <h3>Project Name: <strong>{project.name}</strong></h3>
                            <h3>Upload date: <strong>{project.uploadDate.slice(0,10)}</strong></h3>
                            <Link><i class='fa fa-trash'></i></Link>
                        </div>
                        </Link>
                    }
                    else{
                        return <Link to={`/${userid}/${project._id}`}>
                            <div className="all-users-projects">
                            <h3>Project Name: <strong>{project.name}</strong></h3>
                            <h3>Project domain: <strong>{project.domain}</strong></h3>
                            <h3>Upload date: <strong>{project.uploadDate.slice(0,10)}</strong></h3>
                        </div>
                        </Link>
                    }
                }
            })
            :
            <h1>User doesn't posted any project yet</h1>
        }
      </div>
    </div>
  )
}

export default ParticularUserProjects
