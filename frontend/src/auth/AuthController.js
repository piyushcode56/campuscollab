import { createContext, useContext } from "react";
import React from "react";
import { useState } from "react";
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(()=>{
        const authenticationToken = localStorage.getItem('token');
        if(authenticationToken){
            return true;
        }else{
            return false;
        }
    });
    console.log(isAuthenticated);
    const logout = ()=> setIsAuthenticated(false);
    const login = ()=>setIsAuthenticated(true);
    return(
        <AuthContext.Provider value={{isAuthenticated, logout, login}}>
            {children}
        </AuthContext.Provider>
    );
}
