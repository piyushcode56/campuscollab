import React, { useState, useEffect } from 'react'
import { useRef } from 'react';
import './AddProject.css';
import { handleSuccess, handleError } from '../Utils';
import { ToastContainer } from 'react-toastify';
const AddProject = () => {

  const fileInputRef = useRef(null);
  const [teamDevelopers, setTeamDevelopers] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [image, setImage] = useState();
  const [documents, setDocuments] = useState([]);
  const [modalType, setModalType] = useState();
  const [modalContent, setModalContent] = useState();
  const userid = localStorage.getItem('userId');
  const [projectData, setProjectData] = useState({
      name:'',
      domain:'',
      introduction:'',
      developer:'',
      developers:{
        developer1:{

        },
        developer2:{

        },
        developer3:{

        },
        developer4:{

        },
        developer5:{

        }
      },
      description:'',
      otherLinks:''
  })

  const handleProjectData = (e) => {
    const {name, value} = e.target;

    setProjectData((prevData) => ({
      ...prevData,
      [name]:value
    }))
  }

  const handleDevelopers = (e) =>{
    console.log(e);
    if(e.toLowerCase() === "team"){
      setTeamDevelopers(true);
    }
    if(e.toLowerCase() === "individual"){
      setTeamDevelopers(false);
    }
  }
  function selectFiles(){
    fileInputRef.current.click();
  }
  const onTitleImageSelect = (e) => {
    const file = e.target.files;
    if(!file[0].type.includes('image')){
      return alert('only image is allowed')
    }
    else{
      setImage({
        name:file[0].name,
        url:URL.createObjectURL(file[0]),
        type:file[0].type,
        size:file[0].size,
        file:file[0]
      })
    }
  }
  const onFileSelect = (e) => {
    const files = e.target.files;

    if(files.length === 0) {
      return;
    }

    for(let i=0; i<files.length; i++){
      if(files[i].type.split('/')[0] === 'image'){
        if(!images.some((e)=>e.name === files[i].name)){
          setImages((prevImages) => [
            ...prevImages,
            {
              name: files[i].name,
              url: URL.createObjectURL(files[i]),
              type:files[i].type || 'unknown',
              size:files[i].size || 0,
              file:files[i]
            }
          ])
        }
      }
      if(files[i].type.split('/')[0] === 'video'){
        if(!videos.some((e) => e.name === files[i].name)){
          setVideos((prevVideos) => [
            ...prevVideos,
            {
              name : files[i].name,
              url : URL.createObjectURL(files[i]),
              type:files[i].type || 'unknown',
              size:files[i].size || 0,
              file:files[i]
            }
          ])
        }
      }
    }
  }

  const onDocumentSelect = (e)=> {
    const files = e.target.files;
    console.log(files);
    const allowedFileTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
        "text/markdown"
    ]
    for(let i=0; i<files.length; i++){
       const file = files[i];

       if(allowedFileTypes.includes(file.type)){
          setDocuments((prevDocuments) => [
            ...prevDocuments,
            {
              name:file.name,
              url:URL.createObjectURL(file),
              type:file.type || 'unknown',
              size:file.size || 0,
              file:file
            }
          ])
       }
    }
  }
  console.log(projectData.developer3);
  const handleProjectSubmit = async(e)=>{
    e.preventDefault();
    console.log('button is pressed');
    try{
      const formData = new FormData();
      formData.append('projectData', JSON.stringify({
        name:projectData.name,
        domain:projectData.domain,
        introduction:projectData.introduction,
        developer:projectData.developer,
        description:projectData.description,
        otherLinks:projectData.otherLinks,
        
      }));
      
      formData.append('projectDevelopers', JSON.stringify({
        developer1:projectData.developer1,
        developer2:projectData.developer2,
        developer3:projectData.developer3,
        developer4:projectData.developer4,
        developer5:projectData.developer5
      }))
      images.forEach((image) => {
        formData.append('files', image.file)
      })
      videos.forEach((video) => {
        formData.append('files', video.file)
      })
      documents.forEach((document) => {
        formData.append('files', document.file)
      })
      formData.append('image', image.file)
      // const files = [
      //   ...images.map((image) => ({
      //     fileName:image.name,
      //     fileType:image.type,
      //     fileUrl:image.url,
      //     fileSize:image.size
      //   })),
      //   ...videos.map((video) => ({
      //     fileName:video.name,
      //     fileType:video.type,
      //     fileUrl:video.url,
      //     fileSize:video.size
      //   })),
      //   ...documents.map((document) => ({
      //     fileName:document.name,
      //     fileType:document.type,
      //     fileUrl:document.url,
      //     fileSize:document.size
      //   })),

      // ]
      // formData.append('files', JSON.stringify(files));

      
      
      const url = 'http://localhost:8000/projects/uploads';
      const response = await fetch(url, {
        method:'POST',
        headers:{
          userid:userid,
          'Authorization':localStorage.getItem('token')
        },
        body:formData
      })
      const result = await response.json();
      console.log(result);
      const {success, error, message} = result;
      if(success){
        handleSuccess(success);
        setProjectData({
          name:'',
          domain:'',
          developer:'',
          introduction:'',
          developers:{
            developer1:'',
            developer2:'',
            developer3:'',
            developer4:'',
            developer5:''
          },
          description:'',
          otherLinks:''
          })
          setImages([]);
          setVideos([]);
          setDocuments([]);
          setImage();
        
      }
      if(message){
        handleError(message);
      }
      if(error){
        handleError(error);
      }
      
    }
    catch(error){
      console.log(error);
    }
  }
  const handleMediaModal = (media, type) => {
    setModalContent(media);
    setModalType(type)
  }

  function handleModalCancel(){
    setModalContent();
    setModalType();
  }

  const handleMediaCancel = (media, type) => {
    if(type === 'singleImage'){
      setImage();
    }
    if(type === 'video'){
      const filteredVideos = videos && videos.filter((video) => (
        video.url !== media
      ))
      setVideos(filteredVideos);
      return;
    }
    if(type === 'image'){
      const filteredImage = images && images.filter((image) => (
        image.url !== media
      ))
      setImages(filteredImage);
      
    }
    else{
      const filteredDocuments = documents && documents.filter((document) => (
        document.url !== media
      ))
      setDocuments(filteredDocuments);
    }
  }
  // console.log(videos);
  // console.log(images);

  useEffect(() => {
    // console.log(videos);
  },[videos])

  useEffect(() => {
    // console.log(images);
  },[images])

  useEffect(() => {
    // console.log(documents);
  },[documents])
  // console.log(documents);
  console.log(image);
  return (
    <div className="add-project-page">
      <h1>Add Project</h1>
      <form action="" onSubmit={handleProjectSubmit} className='project-form'>
        <div className="project-metadata">
          <input type="text" name='name' placeholder='Enter your project name' value={projectData.name} required onChange={handleProjectData}/>
          <textarea name="introduction" value={projectData.introduction} rows={10} cols={10} placeholder='Provide a brief introduction about your project' onChange={handleProjectData} id=""></textarea>
          <select name="domain" id="" onChange={handleProjectData} value={projectData.domain}>
          <option value="">Select domain for project</option>
          <option value="software project">Software Project</option>
          <option value="hardware project">Hardware Project</option>
          <option value="Both(software and hardware)">Both (Software and Hardware)</option>
          <option value="others">Others</option>
        </select>
        <select id="" onChange={handleProjectData} onClick={(e)=>handleDevelopers(e.target.value)}>
          <option value="individual">Individual Project</option>
          <option value="team">Team Project</option>
        </select>
        <div>
        {
            teamDevelopers ? 
            <div className="team-class">
            <input type="text" name='developer1' value={projectData.developer1} placeholder='Team Member 1' onChange={handleProjectData}/>
            <input type="text" name='developer2' value={projectData.developer2} placeholder='Team Member 2' onChange={handleProjectData}/>
            <input type="text" name='developer3' value={projectData.developer3} placeholder='Team Member 3' onChange={handleProjectData}/>
            <input type="text" name='developer4' value={projectData.developer4} placeholder='Team Member 4' onChange={handleProjectData}/>
            <input type="text" name='developer5' value={projectData.developer5} placeholder='Team Member 5' onChange={handleProjectData}/>
          </div> :
            <div className="individual-class">
            <input type="text" name='developer' value={projectData.developer} placeholder='Enter the name of developer' onChange={handleProjectData}/>
          </div>
          
          }
        </div>
        <textarea name="description" placeholder='Provide description for your project' id="" onChange={handleProjectData} value={projectData.description} rows={20} cols={10}></textarea>
          <div className="project-title-image">
            <h3>Upload your title image</h3>
            <div className="project-title-image-upload">
            <input type="file" name='file' onChange={onTitleImageSelect}/>
            </div>
          
          {
            image
            ?
            <div className="title-image ">
                <img src={image.url} width={200} alt="" onClick={()=>handleMediaModal(image.url, 'image')}/>
                <i class='fa-solid fa-x cancel-button' onClick={()=>handleMediaCancel(image.url, 'singleImage')}></i>
              </div>
              :
              ''
          }
          </div>
        </div>
        <div className="project-media">
          <p style={{color:'red', textAlign:'center'}}>(Maximum 15 documents are allowed including images and videos, per file size limit: 100MB)</p>
        <h3>Upload Images</h3>
          <div className="project-image">
            <div className="project-upload">
            <input type="file"  multiple name='file' onChange={onFileSelect}/>
            </div>
            <p>This website supports the images of (jpg, png, jpeg, gif) types.</p>
            <div className="uploaded-images">
            { 
            images && images.map((image) => (
              <div className="images ">
                <img src={image.url} alt="" onClick={()=>handleMediaModal(image.url, 'image')}/>
                <i class='fa-solid fa-x cancel-button' onClick={()=>handleMediaCancel(image.url, 'image')}></i>
              </div>
            ))
          }
            </div>
          </div>
          <h3>Upload Videos</h3>
          <div className="project-video">
            <div className="project-upload">
            <input type="file"  multiple name='file' onChange={onFileSelect}/>
            </div>
            <p>This website supports the videos of (mp4, mp3, avi, mov) types.</p>
            <div className="uploaded-videos">
                {
                  videos && videos.map((video) => (
                    <div className="videos">
                      <video src={video.url} width={150} height={150} onClick={()=>handleMediaModal(video.url, 'video')}></video>
                      <i class='fa-solid fa-x cancel-button' onClick={()=>handleMediaCancel(video.url, 'video')}></i>
                    </div>  
                  ))
                }
            </div>
          </div>
          {
            modalContent ?
            <div className="modal-media">
              <div className="modal-content">
                {
                  modalType === 'image' ?
                  <div className="modal-image">
                    <img src={modalContent} alt="" />
                    <i className='fa-solid fa-x cancel-button' onClick={handleModalCancel}></i>
                  </div>
                  :
                  <div className="modal-video">
                    <video src={modalContent} controls></video>
                    <i className='fa-solid fa-x cancel-button' onClick={handleModalCancel}></i>
                  </div>
                }
              </div>
            </div>
            :
            ''

          }
          <h3>Upload Documents</h3>
          <div className="project-document">
            <div className="project-upload">
            <input type="file" multiple onChange={onDocumentSelect}/>
            </div>
            <p>This website supports the documents of (pdf, docx, pptx, txt, md) types.</p>
            <div className="uploaded-documents">
              {
                documents && documents.map((document) => (
                  <div className="documents">
                    <a href={document.url} target='_blank'>{document.name}</a>
                    <i class='fa-solid fa-x cancel-button' onClick={()=>handleMediaCancel(document.url, 'document')}></i>
                  </div>
                  
                ))
              }
            </div>
          </div>
        </div>
        <div className="other-links">
        <input type="text" name='otherLinks' placeholder='Provide other links' value={projectData.otherLinks}  onChange={handleProjectData}/>
        </div>
        <div className="add-project-button">
        <button type='submit'>Add Project</button>
        </div>
      </form>
      <ToastContainer position='top-right' theme='dark'/>
    </div>
  )
}

export default AddProject
