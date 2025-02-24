import React from 'react'
import './Footer.css';
import campuscollabImage from '../assets/campuscollab3.jpeg';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <div className='footer-component'>
        <div className="footer-first-section">
          <img src={campuscollabImage} alt="" />
        </div>
        <div className="footer-second-section">
            <h3 >Projects</h3>
            <a href="/addprojects">Upload Projects</a>
            <a href="/myprojects">Your Projects</a>
        </div>
        <div className="footer-third-section">
            <h3 style={{color:'cyan'}}>Follow us on</h3>
            <ul className='follow-us-links'>
            <a href=""><i className='fa-brands fa-instagram'></i>Instagram</a>
            <a href=""><i className='fa-brands fa-github'></i>GitHub</a>
            <a href=""><i className='fa-brands fa-linkedin'></i>LinkedIn</a>
            <p>Mail: piyushjha8282@gmail.com</p>
            </ul>
            
        </div>
    </div>
  )
}

export default Footer
