import React, { useEffect, useState } from 'react';
import './Navbar.css';
import logo from '../../assets/3Netra_logo.png';
import { Link,useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // This function will be the event handler
    const handleScroll = () => {
      window.scrollY > 150 ? setIsSticky(true) : setIsSticky(false);
    };

    // Add the event listener when the component mounts
    window.addEventListener('scroll', handleScroll);

    // This is the cleanup function
    // It removes the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // The empty array ensures this effect runs only once

  return (
    <nav className={(isSticky || location.pathname !== '/') ? 'nav_dark' : ''}>
      <Link to="/">
        <img src={logo} alt="Logo" className="logo" />
      </Link>
      
      <ul className="nav-links">
        <li><Link to="/submit_report">Submit Report</Link></li>
        <li><Link to="/reports">Reports</Link></li>
        <li><Link to="/my-submissions">My Submissions</Link></li>
        <li><Link to="/map-overview">Map Overview</Link></li>
        <li><Link to="/signin" className="s-btn">Sign In</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;