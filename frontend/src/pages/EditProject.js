import React, { useEffect, useState } from 'react'
import AddProject from './AddProject'
import { useParams } from 'react-router-dom';
import './EditProject.css';
import { handleSuccess, handleError } from '../Utils';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
const EditProject = () => {
    const navigate = useNavigate();
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
    
    const {projectId} = useParams();
    const [teamDevelopers, setTeamDevelopers] = useState()
    const [newImages, setNewImages] = useState([]);
    const [newVideos, setNewVideos] = useState([]);
    const [newDocuments, setNewDocuments] = useState([]);
    const [existingFiles, setExistingFiles] = useState([]);
    const [previousImages, setPreviousImages] = useState([]);
    const [previousVideos, setPreviousVideos] = useState([]);
    const [previousDocuments, setPreviousDocuments] = useState([]);

    const allowedFileTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "text/plain",
        "text/markdown"
    ]
    const fetchProjectData = async() => {
        try{
            const url = `http://localhost:8000/projects/editprojectdata/${projectId}`;
            const response = await fetch(url, {
                method:'GET',
                headers:{
                    'Authorization':localStorage.getItem('token')
                }
            })
            const result = await response.json();
            // console.log(result.newProject);
            setExistingFiles(result.newProject);
            const images = result.newProject.files.filter((prevImage) => (
                prevImage.fileType.includes('image')
            ))
            const videos = result.newProject.files.filter((prevVideo) => (
                prevVideo.fileType.includes('video')
            ))
            
            const documents = result.newProject.files.filter((prevDocument) => (
                allowedFileTypes.includes(prevDocument.fileType)
            ))

            setPreviousImages(images);
            setPreviousVideos(videos);
            setPreviousDocuments(documents);
            
        }
        catch(error){
            console.log(error);
        }
    }
    const handleDevelopers = (e) => {
        if(e == 'team'){
            setTeamDevelopers(e)
            existingFiles.developer = ''
        }
        else{
            setTeamDevelopers()
        }
    }

    const onFileSelect = (e)=>{
        const files = e.target.files;

        if(files.length === 0) {
            return;
          }
          for(let i=0; i<files.length; i++){
            if(files[i].type.split('/')[0] === 'image'){
              if(!newImages.some((e)=>e.name === files[i].name)){
                setNewImages((prevImages) => [
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
              if(!newVideos.some((e) => e.name === files[i].name)){
                setNewVideos((prevVideos) => [
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
    
    const onDocumentSelect = (e)=>{
        const files = e.target.files;
        for(let i=0; i<files.length; i++){
            const file = files[i];
     
            if(allowedFileTypes.includes(file.type)){
               setNewDocuments((prevDocuments) => [
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
    const handleProjectData = (e)=>{
        const {name, value} = e.target;
        setExistingFiles((prevData) => ({
            ...prevData,
            [name]:value
        }))
    }

    const handlePreviousMediaCancel = (type, media) => {
        if(type === 'image'){
            const filteredImage = previousImages.filter((prevImage) => (
                prevImage.fileUrl !== media
            ))
            setPreviousImages(filteredImage);
        }
        else if(type === 'video'){
            const filteredVideo = previousVideos.filter((prevVideo) => (
                prevVideo.fileUrl !== media
            ))
            setPreviousVideos(filteredVideo);
        }
        else{
            const filteredDocument = previousDocuments.filter((prevDocument) => (
                prevDocument.fileUrl !== media
            ))
            setPreviousDocuments(filteredDocument);
        }
    }

    const handleMediaCancel = (type, media) => {
       
        if(type === 'image'){
            const filteredImage = newImages && newImages.filter((image) => (
                image.url !== media
            ))
            setNewImages(filteredImage);
        }
        else if(type === 'video'){
            const filteredVideo = newVideos && newVideos.filter((video) => (
                video.url !== media
            ))
            setNewVideos(filteredVideo);
        }
        else{
            const filteredDocument = newDocuments && newDocuments.filter((document) => (
                document.url !== media
            ))
            setNewDocuments(filteredDocument);
        }
          
    }
    
    const handleEditProjectSubmit = async(e) => {
        e.preventDefault();
        try{
            Swal.fire({
                                title: "Update Project?",
                                // showDenyButton: true,
                                showCancelButton: true,
                                confirmButtonText: "Yes",
                                denyButtonText: `Don't save`
                              }).then((result) => {
                                /* Read more about isConfirmed, isDenied below */
                                if (result.isConfirmed) {
                                    projectUpdated();
                                } 
                              });
        }
        catch(error){
            console.log(error);
        }
    }
    const projectUpdated = async() => {
        try{
            const formData = new FormData();
            formData.append('existingProjectDetails', JSON.stringify({
                name:existingFiles.name,
                introduction:existingFiles.introduction,
                domain:existingFiles.domain,
                developer:existingFiles.developer,
                description:existingFiles.description,
                otherLinks:existingFiles.otherLinks
            }))
            formData.append('projectDevelopers', JSON.stringify({
                developer1:existingFiles.developer1,
                developer2:existingFiles.developer2,
                developer3:existingFiles.developer3,
                developer4:existingFiles.developer4,
                developer5:existingFiles.developer5
            }))
            
            // previousImages.forEach((prevImages) => (
            //     formData.append('existingFiles', JSON.stringify({
            //         fileName:prevImages.fileName,
            //         fileSize:prevImages.fileSize,
            //         fileType:prevImages.fileType,
            //         fileUrl:prevImages.fileUrl
            //     }))
            // ))
            // previousVideos.forEach((prevVideos) => {
            //     formData.append('existingFiles', JSON.stringify({
            //         fileName:prevVideos.fileName,
            //         fileSize:prevVideos.fileSize,
            //         fileType:prevVideos.fileType,
            //         fileUrl:prevVideos.fileUrl
            //     }))
            // })

            // previousDocuments.forEach((prevDocument) => {
            //     formData.append('existingFiles', JSON.stringify({
            //         fileName:prevDocument.fileName,
            //         fileSize:prevDocument.fileSize,
            //         fileType:prevDocument.fileType,
            //         fileUrl:prevDocument.fileUrl
            //     }))
            // })

            const changedExistingFiles = [...previousImages, ...previousVideos, ...previousDocuments];
            formData.append('existingFiles', JSON.stringify(changedExistingFiles));

            newImages.forEach((image) => {
                formData.append('editedFiles', image.file)
              })
            newVideos.forEach((video) => {
                formData.append('editedFiles', video.file)
            })
            newDocuments.forEach((document) => {
                // console.log(document)
                formData.append('editedFiles', document.file)
            })

            const url = `http://localhost:8000/editproject/edit/project/${projectId}`;
            const response = await fetch(url, {
                method:'POST',
                headers:{
                    'Authorization':localStorage.getItem('token')
                },
                body:formData
            })
            const result = await response.json();
            const {success} = result;
            if(success){
                handleSuccess(success);
                setTimeout(() => {
                    navigate('/myprojects');
                },2000)
            }
        }
        catch(error){
            console.log(error);
        }

    }
    // console.log(newImages);
    useEffect(() => {
        fetchProjectData();
    },[projectId])
    // console.log(existingFiles);
    console.log(previousImages);
    // console.log(newImages)
    
  return (
    <div className="edit-project-page">

        <h2 style={{marginBottom:'20px'}}>Edit Project</h2>
       <form action="" onSubmit={handleEditProjectSubmit}>
            <div className="edit-project-details">
            <input type="text" name='name' placeholder='Enter new project name' onChange={handleProjectData} value={existingFiles.name}/>
            <textarea name="introduction" rows={10} cols={10} value={existingFiles.introduction} onChange={handleProjectData} id=""></textarea>
            <select name="domain" id="" value={existingFiles.domain} onChange={handleProjectData}>
          <option value="">Select domain for project</option>
          <option value="software project">Software Project</option>
          <option value="hardware project">Hardware Project</option>
          <option value="Both(hardware and software)">Both (Hardware and Software)</option>
          <option value="others">Others</option>
            </select>
            <select id="" onClick={(e)=>handleDevelopers(e.target.value)}>
          <option value="individual">Individual Project</option>
          <option value="team">Team Project</option>
        </select>
        {
            teamDevelopers ? 
            <div className="team-class">
            <input onChange={handleProjectData} type="text" name='developer1' value={existingFiles.developer1} placeholder='Team Member 1' />
            <input onChange={handleProjectData} type="text" name='developer2' value={existingFiles.developer2} placeholder='Team Member 2' />
            <input onChange={handleProjectData} type="text" name='developer3' value={existingFiles.developer3} placeholder='Team Member 3' />
            <input onChange={handleProjectData} type="text" name='developer4' value={existingFiles.developer4} placeholder='Team Member 4' />
            <input onChange={handleProjectData} type="text" name='developer5' value={existingFiles.developer5} placeholder='Team Member 5' />
          </div> :
            <div className="individual-class">
            <input type="text" name='developer' onChange={handleProjectData} value={existingFiles.developer} placeholder='Enter the name of developer'/>
          </div>
          
          }
          <textarea name="description" onChange={handleProjectData} placeholder='Provide description for your project' id="" value={existingFiles.description} rows={20} cols={10}></textarea>
            </div>
            <div className="edit-project-media">
          <p style={{color:'red', textAlign:'center'}}>(Maximum 15 documents are allowed including images and videos, per file size limit: 100MB)</p>
        <h3>Upload new Images</h3>
          <div className="edit-project-image">
            <div className="edit-project-upload">
            <input type="file"  multiple name='file' onChange={onFileSelect}/>
            </div>
            <p>This website supports the images of (jpg, png, jpeg, gif) types.</p>
            <div className="uploaded-images">
            {/* {
  existingFiles.files &&
  existingFiles.files.map((file) => {
    if (file.fileType.includes('image')) {
      const parsedUrl = file.fileUrl.replace(/\\/g, '/').replace(/^uploads\//, '');
      const imageUrl = `http://localhost:8000/uploads/${parsedUrl}`;
      return (
        <div className="images" key={file.fileUrl}>
          <img width={200} src={imageUrl} alt="Uploaded Image" />
          <i
            className="fa-solid fa-x cancel-button"
            onClick={() => handleMediaCancel("image", file.fileUrl)}
          ></i>
        </div>
      );
    }
   
  })
} */}
{
    previousImages 
    &&
    previousImages.map((prevImage) => {
        const parsedUrl = prevImage.fileUrl.replace(/\\/g, '/').replace(/^uploads\//, '');
        const imageUrl = `http://localhost:8000/uploads/${parsedUrl}`;
        return <div className="images">
            <img width={200} src={imageUrl} alt="Uploaded Image" />
          <i
            className="fa-solid fa-x cancel-button"
            onClick={() => handlePreviousMediaCancel("image", prevImage.fileUrl)}
          ></i>
        </div>
    })
}
                {
  newImages &&
    newImages.map((image, index) => (
      <div className="images" key={index}>
        <img width={200} src={image.url} alt="New Image" />
        <i
          className="fa-solid fa-x cancel-button"
          onClick={()=> handleMediaCancel("image", image.url)}
        ></i>
      </div>
    ))
}
            </div>
          </div>
          <h3>Upload new Videos</h3>
          <div className="edit-project-video">
            <div className="edit-project-upload">
            <input type="file"  multiple name='file' onChange={onFileSelect}/>
            
            </div>
            <p>This website supports the videos of (mp4, mp3, avi, mov) types.</p>
            <div className="uploaded-videos">
            {
                    previousVideos 
                    &&
                    previousVideos.map((prevVideo) => {
                        const parsedUrl = prevVideo.fileUrl.replace(/\\/g, '/').replace(/^uploads\//, '');
                        const videoUrl = `http://localhost:8000/uploads/${parsedUrl}`;
                
                        return <div className="videos">
                            <video width={200} src={videoUrl} alt="Uploaded Image" />
                          <i
                            className="fa-solid fa-x cancel-button"
                            onClick={() => handlePreviousMediaCancel("video", prevVideo.fileUrl)}
                          ></i>
                        </div>
                    })
                    
                }
                {
                    newVideos
                    &&
                    newVideos.map((video) => {
                        return <div className="videos">
                            <video width={200} src={video.url} alt="" />
                            <i class='fa-solid fa-x cancel-button'   onClick={()=>handleMediaCancel("video", video.url)}></i>

                        </div>
                    })
                   
                }
            </div>
          </div>
         
          <h3>Upload new Documents</h3>
          <div className="edit-project-document">
            <div className="edit-project-upload">
            <input type="file" name='file' multiple onChange={onDocumentSelect}/> 
            </div>
            <p>This website supports the documents of (pdf, docx, pptx, txt, md) types.</p>
            <div className="uploaded-documents">
              {
                previousDocuments 
                &&
                previousDocuments.map((prevDocument) => {
                    const parsedUrl = prevDocument.fileUrl.replace(/\\/g, '/').replace(/^uploads\//, '');
                    const documentUrl = `http://localhost:8000/uploads/${parsedUrl}`;
                    return <div className="documents">
                        <a href={documentUrl}>{prevDocument.fileName}</a>
                      <i
                        className="fa-solid fa-x cancel-button"
                        onClick={() => handlePreviousMediaCancel("document", prevDocument.fileUrl)}
                      ></i>
                    </div>
                })
               
              }
              
                {
                    newDocuments
                    &&
                    newDocuments.map((document) => {
                        return <div className="documents">
                            <a href={document.url}>{document.name}</a>
                            <i class='fa-solid fa-x cancel-button'  onClick={()=>handleMediaCancel("document", document.url)}></i>
                        </div>
                    })
                    
                }
              
            </div>
          </div>
        </div>
        <div className="edit-otherLinks">
            <input type="text" name='otherLinks' placeholder='Enter new links ' onChange={handleProjectData} value={existingFiles.otherLinks}/>
        </div>

        <div className="update-button">
            <button type='submit'>Update Project</button>
        </div>
       </form>
       <ToastContainer position='top-center' theme='dark'/>
    </div>
  )
}

export default EditProject
