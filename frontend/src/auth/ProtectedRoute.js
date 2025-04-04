import React from 'react'
import { useAuth } from './AuthController';
import { Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const ProtectedRoute = () => {
    const location = useLocation();
    const {isAuthenticated} = useAuth();
    console.log(location.pathname)
    if(isAuthenticated && (location.pathname === "/login" || location.pathname === "/signup")){
        return <Navigate to={'/'} replace/>
    }
    if(!isAuthenticated){
        return <Navigate to={'/login'} replace/>
    }
    else{
        return <Outlet/>
    }
}

export default ProtectedRoute
