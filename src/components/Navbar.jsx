import React from 'react';
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <header>
      <h1>ShopEase</h1>
      <nav>
        <a href="#">Home</a>
        <a href="#products">Products</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>

        <input
          type="text"
          placeholder="Search products..."
          className="search-bar"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <button className="nav-btn" onClick={() => navigate('/cart')}>🛒 Cart</button>

        {!isLoggedIn ? (
          <button className="nav-btn" onClick={() => navigate('/login')}>Login</button>
        ) : (
          <button className="nav-btn" onClick={handleLogout}>Logout</button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;