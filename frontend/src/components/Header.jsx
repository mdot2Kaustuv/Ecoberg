import React,{useContext} from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
  const {user, logoutUser} = useContext(AuthContext);


  return (
 <nav className="navbar navbar-expand-lg navbar-dark bg-success px-3">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Ecoberg Logo" height="40" className="me-2" />
          <span className="fw-bold">Ecoberg</span>
        </Link>

        <div className="ms-auto">
          {user ? (
            <>
              <span className="text-light me-3">Hello, {user.username}</span>
              <button onClick={logoutUser} className="btn btn-outline-light">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
              <Link to="/register" className="btn btn-light text-success">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Header;