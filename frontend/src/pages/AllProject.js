import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import './AllProject.css';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { handleError, handleSuccess } from '../Utils';
const AllProject = ({projects, users}) => {
    const [filteredProjects, setFilteredProjects] = useState();
    const [searchQuery, setSearchQuery] = useState();
    // const [selectFilter, setSelectFilter] = useState();
    function handleSearch(){
        if(!searchQuery){
           return alert('First enter something to search')
        }
        const userFilteredProjects = projects && projects.filter((project) => (
            project.name.toLowerCase().includes(searchQuery.toLowerCase())
        ))
        setFilteredProjects(userFilteredProjects);
        
    }

    const selectSearchFilter = (e) => {
        const selectFilteredProjects = projects && projects.filter((project) => (
            project.domain.toLowerCase().includes(e.toLowerCase())
        ))
        setFilteredProjects(selectFilteredProjects);
    }

    const handleRemoveProject = (projectId) => {
        Swal.fire({
                title: "Are you sure you want to delete project?",
                // showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Yes",
                denyButtonText: `Don't save`
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                removeProject(projectId);
                } 
            });
    }

    async function removeProject(projectId) {
        try{
            const url = 'http://localhost:8000/projects/delete-project';
            const response = await fetch(url, {
                method:'DELETE',
                headers:{
                    projectid:projectId
                }
            })
            const result = await response.json();
            const {success, error} = result;
            if(success){
                handleSuccess(success);
                window.location.reload();
            }
            if(error){
                handleError(error);
            }
        }
        catch(error){
            console.error(error);
        }
    }
  return (
    <div className='all-users-projects-page'>
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
        
      <div className="all-users-projects-page-section">
      { !projects
        ?
        <div className="loading">

        </div>
        :
        Array.isArray(projects) && projects.length > 0
         ?
         Array.isArray(filteredProjects) && filteredProjects.length > 0
         ?
         filteredProjects.map((project) => {
            const filteredUserName = users && users.filter((user) => user._id === project.user);
            if(filteredUserName[0]._id === project.user){
                return <Link to={`/admin/${filteredUserName[0]._id}/project/${project._id}`}>
                    <div className="all-users-projects">
                    <h3>Username: <strong>{filteredUserName[0].username}</strong></h3>
                    <h3>Project Name: <strong>{project.name}</strong></h3>
                    <h3>Upload date: <strong>{project.uploadDate.slice(0,10)}</strong></h3>
                    <Link><i onClick={()=>handleRemoveProject(project._id)} class='fa fa-trash'></i></Link>
                </div>
                </Link>
            }
         })
         :
         projects.map((project) => {
            const filteredUserName = users && users.filter((user) => user._id === project.user);
            console.log(filteredUserName);
            if(filteredUserName[0]._id === project.user){
                return <Link to={`/admin/${filteredUserName[0]._id}/project/${project._id}`}>
                    <div className="all-users-projects">
                    <h3>Username: <strong>{filteredUserName[0].username}</strong></h3>
                    <h3>Project Name: <strong>{project.name}</strong></h3>
                    <h3>Upload date: <strong>{project.uploadDate.slice(0,10)}</strong></h3>
                    <Link><i onClick={()=>handleRemoveProject(project._id)} class='fa fa-trash'></i></Link>
                </div>
                </Link>
            }
            else{
                return '';
            }
         })
         :
         <h2>No Projects</h2>

      }
      </div>
    </div>
  )
}

export default AllProject
