import React, { useEffect } from 'react'
import { useState } from 'react';
import './Favourites.css';
import { Link } from 'react-router-dom';
const Favourites = () => {
    const [favourites, setFavourites] = useState();

    const id = localStorage.getItem('userId');
    const fetchFavourites = async() => {
        try{
            const url = `http://localhost:8000/user/favourites/${id}`;
            const response = await fetch(url, {
                method:'GET',
                headers:{
                    'Authorization':localStorage.getItem('token')
                }
            })
            const result = await response.json();
            setFavourites(result);
        }
        catch(error){
            console.log(error);
        }
    }
    const removeFavourite = async(projectid) => {
        try{
            const url = 'http://localhost:8000/user/remove-favourites';
            const response = await fetch(url, {
                method:'DELETE',
                headers:{
                    'Authorization':localStorage.getItem('token'),
                    projectid:projectid,
                    id:localStorage.getItem('userId')
                }
            })
            const result = await response.json();
            setFavourites(result);
        }
        catch(error){
            console.log(error);
        }
    }
    useEffect(() => {
        fetchFavourites();
    },[])
    useEffect(() => {
        fetchFavourites();
    },[favourites])
 
  return (
    <div className='favourites-page'>
      {
        !favourites
        ?
        <div className="loading">

        </div>
        :
        favourites && Array.isArray(favourites) && favourites.length > 0
        ?
        favourites.map((favourite) => (
            <div className="favourites">
                <div className="favourites-details">
                    <h3>{favourite.name}</h3>
                    <h3>{favourite.domain}</h3>
                    <h3>{favourite.uploadDate.slice(0,10)}</h3>
                    <a href='' onClick={()=>removeFavourite(favourite._id)}>Remove</a>
                    <Link to={`/project/favourite/${favourite._id}`}><i class='fa-solid fa-arrow-right'></i></Link>
                </div>
            </div>
        ))
        :
        <h2>No Favourites</h2>
      }
    </div>
  )
}

export default Favourites
