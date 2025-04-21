import React from 'react'
import './MyProject.css';
import { useState, useEffect } from 'react';
import { Link, UNSAFE_useFogOFWarDiscovery, useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { handleSuccess, handleError } from '../Utils';
import { ToastContainer } from 'react-toastify';
const MyProject = ({users}) => {
    const [userName, setUserName] = useState();
    const [comment, setComment] = useState();
    const [allComments, setAllComments] = useState([]);
    const navigate = useNavigate()
    const location = useLocation();
    const projectid = useParams();
    const projectId = projectid.projectid;
    // console.log(projectId);
    const {userid} = useParams();
    const [project, setProject] = useState();
    const [images, setImages] = useState();
    const [videos, setVideos] = useState();
    const [documents, setDocuments] = useState();
    const [modalContent, setModalContent] = useState();
    const [mediaType, setMediaType] = useState();
    // const [fileUrl, setFileUrl] = useState();
    const handleFavourites = async()=>{
        try{
            const url = 'https://campuscollab-backend.onrender.com/user/add-to-favourites';
            const response = await fetch(url, {
                method:'PUT',
                headers:{
                    'Authorization':localStorage.getItem('token'),
                    projectid:projectId,
                    id:localStorage.getItem('userId'),
                    username:userName
                }
            })
            const result = await response.json();
            const {success, message, error} = result;
            if(success){
                handleSuccess(success)
            } 
            if(message){
                handleError(message)
            }
            if(error){
                handleError(error)
            }
        }
        catch(error){
            console.log(error)
        }
    }
    const fetchProject = async() => {
        
        try{
            const url = `https://campuscollab-backend.onrender.com/projects/project/${projectId}`;
            const response = await fetch(url, {
                method:'GET',
                headers:{
                    'Authorization':localStorage.getItem('token')
                }
            })
            const result = await response.json();
            setProject(result.projects);
            const imageFiles = result.projects.files.filter((file) => (
                /\.(jpeg|jpg|png|gif)$/i.test(file.fileUrl)
            ))

            const videoFiles = result.projects.files.filter((file) => (
                /\.(mp4|avi|mov)$/.test(file.fileUrl)
            ))

            const documentFiles = result.projects.files.filter((file) => (
                /\.(pdf|docx|txt|text|pptx|ppt|md|document)$/.test(file.fileUrl)
            ))
            
            setImages(imageFiles);
            setVideos(videoFiles);
            setDocuments(documentFiles);
        }
        catch(error){
            console.log(error);
        }
    }
    const handleEdit = (id) => {
        Swal.fire({
                    title: "Are you sure you want to edit?",
                    // showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Yes",
                    denyButtonText: `Don't save`
                  }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        navigate(`/edit/project/${projectId}`)
                    } 
                  });
    }
    const handleMediaModal = (media, type)=>{
        setModalContent(media);
        setMediaType(type);
    }

    function handleModalCancel(){
        setModalContent(null);
        setMediaType(null);
    }
    const handleProjectRemove = (projectId) => {
        Swal.fire({
            title: "Are you sure you want to delete?",
            // showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `Don't save`
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                deleteProject(projectId)
            } 
          });
    }
    async function deleteProject(projectId){
        try{
           const url = 'https://campuscollab-backend.onrender.com/projects/delete-project';
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
            setTimeout(() =>{
                location.pathname === 
                `/project/${projectId}`
                ?
                navigate('/myprojects')
                :
                navigate('/admin/allprojects')
            
            }, 2000)
           }
           if(error){
            handleError(error);
           }
        }
        catch(error){
            console.log(error);
        }
    }

    const handleFavouriteRemove = async(id) => {
        try{
            try{
                const url = 'https://campuscollab-backend.onrender.com/user/remove-favourites';
                const response = await fetch(url, {
                    method:'DELETE',
                    headers:{
                        'Authorization':localStorage.getItem('token'),
                        projectid:id,
                        id:localStorage.getItem('userId')
                    }
                })
                const result = await response.json();
                const {success, error} = result;
                if(success){
                    setTimeout(() => {
                        navigate('/favourites');
                    },1000)
                }
                if(error){
                    handleError(error);
                }
            }
            catch(error){
                console.log(error);
            }
        }
        catch(error){
            console.error(error);
        }
    }
    const handleCommentSubmit =  async()=>{
        try{
            if(comment === ''){
                return alert('First give some feedback!')
            }
            const url = 'https://campuscollab-backend.onrender.com/comments/add-comment';
            const response = await fetch(url,{
                method:'POST',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    projectid:projectId,
                    userid:localStorage.getItem('userId'),
                    comment:comment,
                    username:localStorage.getItem('username')
                })
            })
            const result = await response.json();
            const {success, error} = result;
            if(success){
                handleSuccess(success);
                setComment('');
                // setTimeout(() => {
                //     window.location.reload();
                // },2000)
            }
            if(error){
                handleError(error);
            }
            console.log(result);
        }   
        catch(error){
            console.error(error);
        }
    }
    const fetchComments = async()=>{
        try{
            const url = `https://campuscollab-backend.onrender.com/comments/all-comment`;
            const response = await fetch(url, {
                method:'GET',
                headers:{
                    projectid:projectId
                }
            })
            const result = await response.json();
            setAllComments(result);
        }
        catch(error){
            console.error(error);
        }
    }
    useEffect(() => {
        fetchProject();
    },[])

    const fetchUserName = ()=> {
        const filteredUserName = users ? users.filter((user) => user._id === userid):'No username'
        setUserName(filteredUserName[0].username)
    }
    
    useEffect(() => {
        fetchUserName();
    },[users, userid])

    useEffect(()=>{
        fetchComments();
    },[projectId, userid, comment])
    
  return (
    <div className='project-page'>
        {
            location.pathname === `/${userid}/${projectId}`
            ?
            <Link to={`/`}><h3 style={{color:'#39ed07', textAlign:'center'}}>{userName}</h3></Link>
            :
            ''
        }
    { !project
    ?
    <div className="loading">

    </div>
    :
        project ?
        <div className='project-section'>
            
            <div className="project-data-links">
            <a href="#name">Name</a>
                <a href="#introduction">Introduction</a>
                <a href="#domain">Domain</a>
                <a href="#developer">Developer</a>
                <a href="#description">Description</a>
                <a href="#images">Images</a>
                <a href="#videos">Videos</a>
                <a href="#documents">Documents</a>
                <a href="#otherlinks">Other Links</a>
            </div>
            {/* {console.log(project)}  */}
            {/* {console.log(files)}; */}
            {/* {console.log(fileUrl)} */}
            <div className="project-data">
            <div className="project-primary-details">
            <div className="project-basic-info">
            <p id='name'> <strong>{project.name}</strong></p>
            <p id='introduction'> <strong>{project.introduction}</strong></p>
            <div className="domain" id='domain'>
            <p> <strong>{project.domain}</strong></p>
            </div>
            {
                        project.developer === ''?
                        (   
                            project.developers && Object.values(project.developers).map((developer, index) => (
                                developer.trim() !== '' ?
                                <div className="project-developers" id='developer'>
                                    <p>Team Member {index + 1} : <strong>{developer}</strong> </p> 
                                </div> :
                                ''
                            ))
                        )
                         :
                        <p id='developer'> <strong>{project.developer}</strong></p>
                    }
                    <p id='description'><strong>{project.description}</strong></p>
            </div>
                    <div className="project-related-icons">
                        {
                            location.pathname === `/project/${projectId}`
                            ?
                            <div className="icons">
                                <i class='fa-solid fa-star' onClick={() => handleFavourites(projectId)}></i>
                                <i onClick={()=>handleEdit(projectId)} class='fa-solid fa-edit'></i>
                                <i onClick={()=>handleProjectRemove(projectId)} class='fa fa-trash'></i>
                            </div>
                            :
                            location.pathname === `/${userid}/${projectId}`
                            ?
                            <i class='fa-solid fa-star' onClick={() => handleFavourites(projectId)}></i>
                            :
                            location.pathname === `/project/favourite/${projectId}`
                            ?
                            <button className='favourite-remove-button' onClick={()=>handleFavouriteRemove(projectId)}>Remove</button>
                            :
                            <i onClick={()=>handleProjectRemove(projectId)} class='fa fa-trash'></i>
                        }
                        
                    </div>
            </div>
            <div className="secondary-details">
            
                <div className="project-images">
                    <h3 style={{color:'blue'}}  id='images'>Project images</h3>
                    {
                        Array.isArray(images) && images.length > 0
                        ?
                        images.map((image) => {
                        
                            // const parsedUrl = image.fileUrl.replace(/\\/g,'/').replace(/^uploads\//, '')
                            // const imageUrl = `https://campuscollab-backend.onrender.com/uploads/${parsedUrl}`;
                            const imageUrl = image.fileUrl
                            return  <div className='uploaded-images'>
                                <img key={image.fileUrl} src={imageUrl} alt="" onClick={()=>handleMediaModal(imageUrl, 'image')}/>
                                <hr />
                            </div>
                        })
                        :
                        <h2>No Images</h2>
                    }
                </div>
         
                <div className="project-videos" >
                    <h3 style={{color:'blue'}} id='videos'>Project videos</h3>
                    {
                        Array.isArray(videos) && videos.length > 0
                        ?
                        videos.map((video) => {
                        
                            const parsedUrl = video.fileUrl.replace(/\\/g,'/').replace(/^uploads\//, '')
                            const videoUrl = video.fileUrl;
                            return  <div className='uploaded-videos'>
                                <video controls src={videoUrl} onClick={()=>handleMediaModal(videoUrl, 'video')}></video>
                                <hr />
                            </div>
                        })
                        :
                        <h2>No videos</h2>
                    }
                </div>
                {
                    modalContent 
                    ?
                    <div className="modal-media">
                        <div className="modal-content">
                            {
                                mediaType === 'image' 
                                ?
                                <div className="modal-image">
                                    <img src={modalContent} alt="" />
                                    <div className="cancel-button">
                                    <i class='fa-solid fa-x' onClick={handleModalCancel}></i>
                                    </div>
                                </div>
                                :
                                <div className="modal-video">
                                    <video controls src={modalContent}></video>
                                   
                                    <div className="cancel-button">
                                    <i class='fa-solid fa-x' onClick={handleModalCancel}></i>
                                    </div>
                                    
                                </div>
                            }
                        </div>
                    </div>
                    :
                    ''
                }
                
                <div className="project-documents">
                <h3 style={{color:'blue'}} id='documents'>Project related documents</h3>
                    {
                        Array.isArray(documents) && documents.length > 0
                        ?
                        documents.map((documentFile) => {
            
                            const documentUrl = documentFile.fileUrl;
                            // console.log(documentUrl);
                            return  <div className='documentFiles'>
                                <a href={documentUrl} target='_blank' download> {documentFile.fileName}</a>
                                <i class='fa-solid fa-download' 
                                onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = documentUrl;
                                    link.download = documentFile.fileName;
                                    link.target = '_blank';
                                    document.body.appendChild(link);
                                    link.click();  
                                    document.body.removeChild(link);
                                }}
                                ></i>
                            </div>
                        })
                        :
                        <h2>No documents</h2>
                    }
                </div>
            </div>
            <div className="other-links-details" style={{marginTop:'30px'}}>
            <h3 style={{color:'blue'}} id='documents'>Project related Links</h3>
                <a style={{color:'cyan', textDecoration:'underline'}} target='_blank' href={project.otherLinks}>{project.otherLinks}</a>
            </div>

            <div className="comment-section">
            {
                location.pathname === `/${userid}/${projectId}`
                ?
                <div className="comment-section">
                    <textarea name="" id="" rows={8} placeholder="What's your feedback on this project" onChange={(e)=>setComment(e.target.value)} required value={comment}></textarea>
                    <button onClick={()=>handleCommentSubmit()}>Submit</button>
                    
                </div>
                :
                ''
            }
            
            </div>
            {
                location.pathname ===  `/${userid}/${projectId}` || location.pathname === `/project/${projectId}` ?
                <div className="user-comment">
                <h3 style={{marginBottom:'20px'}}>Project Reviews</h3>
                {
                    Array.isArray(allComments) && allComments.length > 0
                    ?
                    allComments.slice(0,7).map((userComment) => {
                        
                        return <div className="comments">
                            <Link to={`/${userComment.userid}/projects`}>{userComment.username}</Link>
                            <p>{userComment.comments}</p>
                            
                        </div>
                        
                    })
                    :
                    <p>This project doesn't have any comments yet!</p>
                }
                <div className="all-reviews" style={{marginTop:'30px'}}>
                <Link to={`/${userid}/${projectId}/reviews`}>See all reviews <i class="fa-solid fa-arrow-right"></i></Link>
                </div>
            </div>
            :
            ''
            }
            </div>
        </div>
        :
        <h1>Sorry! no project data available</h1>
    }
    <ToastContainer position='top-center' theme='dark'/>
    </div>
  )
}

export default MyProject
