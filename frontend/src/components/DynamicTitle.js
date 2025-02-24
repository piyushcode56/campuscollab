import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
const DynamicTitle = () => {
    const location = useLocation();

    useEffect(() => {
        switch(location.pathname){
            case '/admin':
                document.title = 'Admin - Campus Collab';
                break;
            
            case '/admin/dashboard':
                document.title = 'Admin dashboard - Campus Collab';
                break;
            
            case '/admin/users':
                document.title = 'Admin users - Campus Collab';
                break;
            
            default:
                document.title = 'Campus Collab'
                break;
        }
    },[location.pathname])
  return (
    null
  )
}

export default DynamicTitle
