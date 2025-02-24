import React from 'react'
import './Navbar.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { handleError, handleSuccess } from '../Utils';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [loggedinUser, setLoggedinUser] = useState();
    const [role, setRole] = useState();
    const userId = localStorage.getItem('userId');
    const [email, setEmail] = useState();
    useEffect(()=>{
        setLoggedinUser(localStorage.getItem('username'))
        setRole(localStorage.getItem('userRole'));
        setEmail(localStorage.getItem('userEmail'))
    },[userId])

    const handleScroll = () => {
        if(window.scrollY > 50){
            setScrolled(true);
        } else{
            setScrolled(false);
        }
    }

    function handleLogout() {
        if(!loggedinUser){
            return alert("No user available kindly login")
        } 
        Swal.fire({
            title: "Do you want to Logout?",
            // showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Yes",
            denyButtonText: `Don't save`
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
            localStorage.removeItem('username');
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userEmail');
            handleSuccess(`${loggedinUser} logged out`)
            setLoggedinUser();
            setTimeout(() => {
                navigate('/login')
            },1000)
            } 
          });
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
    },[])

  return (
    <div className={'navbar-page'} id='navbar'>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
            <div className="navbar_first_section">
                <Link to={role === 'admin' ? '/admin' : '/'}><a href="/"><h2>Campus Collab</h2></a></Link>
            </div>

            <div className="username">
                <h3 style={{color:'cyan'}}>Welcome ~ {
                    !loggedinUser ? "user" : loggedinUser ? `${email}` : ''
                    }</h3>
            </div>
            <div className={role === 'admin' ? 'admin-class' : 'navbar_second_section'}>
                <ul>
                 <Link to={'/'}><a href="/"></a></Link>
                 <Link to={'/addprojects'}><a href="/addprojects">Add Project</a></Link>
                 <Link to={'/myprojects'}><a href="/myprojects">My Project</a></Link>
                 <Link to={'/login'}><a href="/login">Login</a></Link>
                 <Link to={'/signup'}><a href="/signup">Signup</a></Link>
                 <Link to={'/favourites'}><a href="/signup">Favourites</a></Link>
                </ul>
            </div>
            <div className="navbar_third_section">
                <button onClick={handleLogout}>Logout</button>
            </div>
      </nav>
      
    </div>
    
  )
}

export default Navbar
