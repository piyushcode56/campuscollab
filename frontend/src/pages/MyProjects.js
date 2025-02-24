import React from 'react'
import { useState, useEffect } from 'react';
import './MyProjects.css';
import { Link } from 'react-router-dom';
import projectImage from '../assets/projectImage.png'
const MyProjects = () => {
    const [projects, setProjects] = useState();
    const [project, setProject] = useState();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState();
    const [images, setImages] = useState();
    const id = localStorage.getItem('userId');
    const fetchProjects = async() => {
        try{
            const url = `http://localhost:8000/projects/myprojects/${id}`;
            const response = await fetch(url, {
                method:'GET',
                headers:{
                    'Authorization':localStorage.getItem('token'),
                }
            })
            const result = await response.json();
            setProjects(result.projects);
            
        }
        catch(error){
            console.log(error);
        }
    }
    function handleSearch(){
        if(!searchQuery){
            alert("Enter something to search");
        }
        const filteredData = Array.isArray(projects) ? projects.filter((project) => (
            project.name.toLowerCase().includes(searchQuery.toLowerCase())
        )):[]

        setFilteredData(filteredData)
    }  

    const handleFilter = (e) => {
        
        const filteredData = Array.isArray(projects) ? projects.filter((project) => (
            console.log(project) ||
             project.domain.toLowerCase().includes(e.toLowerCase()) 
            
        )):[]
        
        setFilteredData(filteredData);
    }
    const handleClick = (e) => {
        setProject(e);
    }
    const handleCancel = ()=>{
        setProject();
    }

    
    useEffect(() => {
        fetchProjects();
    },[])

    // console.log(filteredData);
  return (
    
    <div className='projects-page'>
        <div className="search-projects">
       
       <div className="search-input-projects">
       <input type="text" placeholder='Search your projects' onChange={(e)=>setSearchQuery(e.target.value)} value={searchQuery}/>
       <button onClick={handleSearch}><i class='fa-solid fa-search'></i></button>
       </div>
       
       <div className="search-filter">
        <select name="" id="" onClick={(e)=>handleFilter(e.target.value)}>
            <option value="">Filter Domain</option>
            <option value="software project">Software Projects</option>
            <option value="hardware project">Hardware Projects</option>
            <option value="Both(software and hardware)">Both(Software and Hardware)</option>
            <option value="others">Others</option>
        </select>
       </div>
        </div>

        <div className="user-projects">
        {   !projects ? <div className="loading"></div> :
            Array.isArray(filteredData) ? 
            filteredData.map((project, index) => (
                <Link>
                <ul key={index} className='projects' onClick={()=>handleClick(project)}>
                <div className="project-image-title">
                    {
                        project && project.image
                        ?
                       <img src={`http://localhost:8000/uploads/${project.image.replace(/\\/g, '/').replace(/^uploads\//, '')}`} alt="" />
                        :
                        <img src={projectImage} alt="" />
                    }
                    </div>
                    <div className="project-name">
                    <h3>{project.name}</h3>
                    </div>
                    <div className="project-domain">
                        <h3>{project.domain}</h3>
                    </div>
                    <div className="project-description">
                        <p>{project.description.slice(0,60)}...</p>
                    </div>
                    <div className="projects-arrow">
                    <Link to={`/project/${project._id}`}><i class="fa-solid fa-arrow-right"></i></Link>
                    </div>
                </ul>
                </Link>
            )) :
            Array.isArray(projects) && projects.length > 0 ?
            projects.map((project, index) => ( 
                <Link>
                 
                <ul key={index} className='projects' onClick={()=>handleClick(project)}>
                    <div className="project-image-title">
                    {
                        project && project.image
                        ?
                       <img src={`http://localhost:8000/uploads/${project.image.replace(/\\/g, '/').replace(/^uploads\//, '')}`} alt="" />
                        :
                        <img src={projectImage} alt="" />
                    }
                    </div>
                    <div className="project-name">
                    <h3>{project.name}</h3>
                    </div>

                    <div className="project-domain">
                        <h3>{project.domain}</h3>
                    </div>
                    <div className="project-description">
                        <p>{project.description.slice(0,60)}...</p>
                    </div>
                    <div className="projects-arrow">
                    <Link to={`/project/${project._id}`}><i class="fa-solid fa-arrow-right"></i></Link>
                    </div>
                </ul>
                </Link>
            )) : <h1 style={{textAlign:'center'}}>No project available</h1>
        }
        </div>
        
         {
            project ? 
            <div className="project">
            <div className='project-information'>
                <div className="project-details">
                    <h3><u>Project Name</u>: <strong>{project.name}</strong></h3>
                    <h3><u>Project domain</u>: <strong>{project.domain}</strong></h3>
                    {
                        project.developer === ''?
                        (   
                            project.developers && Object.values(project.developers).map((developer, index) => (
                                developer.trim() !== '' ?
                                <div className="project-developers">
                                    <h3>Team Member : <strong>{developer}</strong> </h3> 
                                </div> :
                                ''
                            ))
                        )
                         :
                        <h3><u>Project developer</u>: <strong>{project.developer}</strong></h3>
                    }
                    <h3><u>Project description</u>: <strong>{project.description}</strong></h3>
                    <Link to={`/project/${project._id}`}><a href='/project'>See more...</a></Link>
                </div>
                {/* <div className="project-see-more">
                    <Link to={'/project'}>see more...</Link>
                </div> */}
                <div className="cancel-button">
                <i onClick={handleCancel} class="fa-solid fa-x"></i>
                </div>
                
            </div>
            </div>
            :
            ''
        }
        
    </div>
    
  )
}

export default MyProjects
