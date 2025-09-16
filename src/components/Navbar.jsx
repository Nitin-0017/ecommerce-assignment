import React, { useState } from 'react';
import '../styles/Navbar.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ searchQuery, setSearchQuery, scrollToSection }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleScroll = (section) => {
    setMenuOpen(false);
  
    if (location.pathname === '/home') {
      
      if (scrollToSection) scrollToSection(section);
    } else {
     
      navigate('/home', { state: { scrollTo: section } });
    }
  };
  

  return (
    <header className="navbar">
      <h1 className="logo" onClick={() => handleNavigate('/home')}>
        SwiftKart
      </h1>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>

      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <button className="nav-link-btn" onClick={() => handleNavigate('/home')}>Home</button>
        <button className="nav-link-btn" onClick={() => handleNavigate('/products')}>Products</button>
        <button className="nav-link-btn" onClick={() => handleScroll('about')}>About</button>
        <button className="nav-link-btn" onClick={() => handleScroll('contact')}>Contact</button>

        <input
          type="text"
          placeholder="Search products..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </nav>
    </header>
  );
};

export default Navbar;
