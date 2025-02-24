import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { useState } from 'react'
import './SearchUser.css';
import { Link } from 'react-router-dom';
const SearchUser = ({users}) => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('q');
    const [filteredUsers, setFilteredUsers] = useState();

    function fetchSearchedUser(){
        const filteredUser = users && users.filter((user)=>user.username.toLowerCase().includes(searchQuery.toLowerCase()))
        console.log(filteredUser);
        setFilteredUsers(filteredUser);
    }

    useEffect(() => {
        fetchSearchedUser();
    },[searchQuery, users])

  return (
    <div className='searched-users-page'>
        <div className="filtered-username">
        {
            filteredUsers
            ?
            <h2>Search results for '{searchQuery}'</h2>
            :
            ''
        }
        </div>
        <div className="filtered-user">
        {
            filteredUsers
            ?
            filteredUsers.map((filteredUser) => {
                return <Link to={`/${filteredUser._id}/projects`}>
                    <div className="searched-user">
                    <h3>{filteredUser.username}</h3>
                    </div>
                </Link>
            })
            :
            <h1>No results available for '{searchQuery}'</h1>
        }
        </div>
    </div>
  )
}

export default SearchUser
