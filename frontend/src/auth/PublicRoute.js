import React from 'react'
import { useAuth } from './AuthController';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
    const {isAuthenticated} = useAuth();

    if(isAuthenticated){
        return <Navigate to={'/'}/>
    }
    else{
        return <Outlet/>
    }
}

export default PublicRoute
