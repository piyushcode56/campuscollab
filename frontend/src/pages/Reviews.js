import React from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Reviews.css';
const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const {userid} = useParams();
    const {projectId} = useParams();
    const fetchComments = async()=>{
        try{
            const url = `http://localhost:8000/comments/all-comment`;
            const response = await fetch(url, {
                method:'GET',
                headers:{
                    projectid:projectId
                }
            })
            const result = await response.json();
            setReviews(result);
        }
        catch(error){
            console.error(error);
        }
    }

    useEffect(() => {
        fetchComments();
    },[projectId, userid])

  return (
    <div className='review-page'>
      {
        Array.isArray(reviews) && reviews.length > 0
        ?
        reviews.map((userComment) => {
            
            return <div className="comments">
                <Link to={`/${userComment.userid}/projects`}>{userComment.username}</Link>
                <p>{userComment.comments}</p>
            </div>
            
        })
        :
        <p>This project doesn't have any comments yet!</p>
      }
    </div>
  )
}

export default Reviews
