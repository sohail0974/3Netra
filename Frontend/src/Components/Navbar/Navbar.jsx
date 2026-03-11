import React, { useEffect, useState } from 'react';
import './Navbar.css';
import logo from '../../assets/3Netra_logo.png';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Added useNavigate
import { handleSuccess } from '../../Toast'; // Adjust path if needed

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Check if the user is logged in by looking for the token
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('loggedInUser');

  useEffect(() => {
    const handleScroll = () => {
      window.scrollY > 150 ? setIsSticky(true) : setIsSticky(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 2. Create a logout function
  const handleLogout = () => {
    // Clear the storage
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('userEmail');
    
    handleSuccess("Logged out successfully");
    
    // Redirect to home and refresh to clear state
    setTimeout(() => {
      navigate('/');
      window.location.reload(); // Ensures the navbar updates immediately
    }, 1000);
  };

  return (
    <nav className={(isSticky || location.pathname !== '/') ? 'nav_dark' : ''}>
      <Link to="/">
        <img src={logo} alt="Logo" className="logo" />
      </Link>
      
      <ul className="nav-links">
        <li><Link to="/submit_report">Submit Report</Link></li>
        <li><Link to="/reports">Reports</Link></li>
        
        {/* Only show My Submissions if logged in */}
        {token && <li><Link to="/my-submissions">My Submissions</Link></li>}
        
        <li><Link to="/map-overview">Map Overview</Link></li>
        
        {/* 3. Conditionally render the button */}
        {token ? (
          <li>
            <button onClick={handleLogout} className="s-btn" style={{cursor: 'pointer'}}>
              Logout ({userName.split(' ')[0]}) {/* Shows their first name */}
            </button>
          </li>
        ) : (
          <li><Link to="/login" className="s-btn">Sign In</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;