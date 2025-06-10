import React, { useState } from 'react';
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ searchQuery, setSearchQuery, scrollToSection }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const username = localStorage.getItem('username');

  const handleLogout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('username');
  localStorage.removeItem('visited'); // Optional
  setMenuOpen(false);
  navigate('/signup'); 
};

  return (
    <header className="navbar">
      <h1 className="logo" onClick={() => { setMenuOpen(false); navigate('/home'); }}>SwiftKart</h1>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>

      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <button className="nav-link-btn" onClick={() => { setMenuOpen(false); navigate('/home'); }}>Home</button>
        <button className="nav-link-btn" onClick={() => { setMenuOpen(false); scrollToSection('products'); }}>Products</button>
        <button className="nav-link-btn" onClick={() => { setMenuOpen(false); scrollToSection('about'); }}>About</button>
        <button className="nav-link-btn" onClick={() => { setMenuOpen(false); scrollToSection('contact'); }}>Contact</button>

        <input
          type="text"
          placeholder="Search products..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <button className="nav-btn" onClick={() => { setMenuOpen(false); navigate('/cart'); }}>
          🛒 Cart
        </button>

        {isLoggedIn ? (
          <>
            <span className="username">Hello, {username}</span>
            <button className="nav-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
         <button className="nav-btn" onClick={() => { setMenuOpen(false); navigate('/login'); }}>
  Login / Signup
</button>

        )}
      </nav>
    </header>
  );
};

export default Navbar;