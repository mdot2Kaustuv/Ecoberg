import React from 'react';
import logo from '../assets/logo.png';
import Button from './LoginorRegister';

const Header = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success px-3">
      <div className="container-fluid">
    
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img 
            src={logo} 
            alt="Ecoberg Logo" 
            height="40" 
            className="me-2"
          />
          <span className="fw-bold">Ecoberg</span>
        </a>

    
        <div className="ms-auto">
         <Button text="Login" class="btn-outline-light me-2"/>
          &nbsp;
          <Button text="Register" class="btn-light text-success"/>
        </div>
      </div>
    </nav>
  );
};

export default Header;