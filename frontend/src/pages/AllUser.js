import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react';
import './AllUser.css';
import Swal from 'sweetalert2';
import { handleError, handleSuccess } from '../Utils';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import blockImage from '../assets/block.png';
import unblockImage from '../assets/unblock.png'
const AllUser = ({users}) => {
  const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState();
    const [filteredUsers, setFilteredUsers] = useState();

    function handleSearch(){
        if(!searchQuery){
            return alert('First enter username to search')
        }
        const filteredUsers = users && users.filter((user) => (
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
        ))
        setFilteredUsers(filteredUsers);
    }

    const handleUserRemove = (userid) => {
      Swal.fire({
                  title: "Are you sure you want to delete user?",
                  // showDenyButton: true,
                  showCancelButton: true,
                  confirmButtonText: "Yes",
                  denyButtonText: `Don't save`
                }).then((result) => {
                  /* Read more about isConfirmed, isDenied below */
                  if (result.isConfirmed) {
                    removeUser(userid);
                  } 
                });
    }

    async function removeUser(userid){
      try{
        const url = 'http://localhost:8000/user/remove/user';
        const response = await fetch(url, {
          method:'DELETE',
          headers:{
            userid:userid
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

    const handleUserBlock = (userid) => {
      Swal.fire({
        title: "Are you sure you want to block user?",
        // showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `Don't save`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          blockUser(userid);
        } 
      });
    }

    async function blockUser(userid){
      try{
        const url = 'http://localhost:8000/user/block/user';
        const response = await fetch(url, {
          method:'PUT',
          headers:{
            userid:userid
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

    const handleUserUnblock = (userid) => {
      Swal.fire({
        title: "Are you sure you want to unblock user?",
        // showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `Don't save`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          unblockUser(userid);
        } 
      });
    }

    async function unblockUser(userid){
      try{
        const url = 'http://localhost:8000/user/unblock/user';
        const response = await fetch(url, {
          method:'PUT',
          headers:{
            userid:userid
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
    <div className='user-page'>
        <div className="search-user">
        <input type="text" placeholder='Search User' onChange={(e)=>setSearchQuery(e.target.value)}/>
        <button onClick={handleSearch}><i class='fa-solid fa-search'></i></button>
        </div>
      {
        !users
        ?
        <div className="loading">

        </div>
        :
        users
        ?
        filteredUsers ?
        
        filteredUsers.map((user) => {
            return <Link to={`/admin/${user._id}/projects`}>
                <div className="user">
                <img src={user.avatar} alt="" />
                <h3>Name: <strong>{user.name}</strong></h3>
                <h3>Username: <strong>{user.username}</strong></h3>
                <h3>Email: <strong>{user.email}</strong></h3>
                <div className="user-related-icons">
                <Link to={`/${user.username}/${user._id}`}><i class='fa-solid arrow fa-arrow-right'></i></Link>
                <Link><i onClick={()=>handleUserRemove(user._id)} class='fa fa-trash'></i></Link>
                {
                  user.blocked === true
                  ?
                  <Link><img onClick={()=>handleUserUnblock(user._id)} src={unblockImage} alt="" /></Link>
                  :
                  <Link><img onClick={()=>handleUserBlock(user._id)}  src={blockImage} alt="" /></Link>
                }
                </div>
            </div>
            </Link>
        })
        :

        users.map((user) => {
          
            return <Link to={`/admin/${user._id}/projects`}>
                <div className="user">
                <img src={user.avatar} alt="" />
                <h3>Name: <strong>{user.name}</strong></h3>
                <h3>Username: <strong>{user.username}</strong></h3>
                <h3>Email: <strong>{user.email}</strong></h3>
                <div className="user-related-icons">
                <Link to={`/admin/${user._id}/projects`}><i class='fa-solid arrow fa-arrow-right'></i></Link>
                <Link> <i onClick={()=>handleUserRemove(user._id)} class='fa fa-trash'></i></Link>
                {
                  user.blocked === true
                  ?
                  <Link><img onClick={()=>handleUserUnblock(user._id)} src={unblockImage} alt="" /></Link>
                  :
                  <Link><img onClick={()=>handleUserBlock(user._id)}  src={blockImage} alt="" /></Link>
                }
                </div>
            </div>
            </Link>
        })
        :
        <h1>No users present</h1>
      }
      <ToastContainer position='top-center' theme='dark'/>
    </div>
  )
}

export default AllUser
