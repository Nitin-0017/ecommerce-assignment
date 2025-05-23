import React from 'react';
import '../styles/Navbar.css'; 
import { useNavigate } from 'react-router-dom';

const Navbar = ({ searchQuery, setSearchQuery }) => {
    const navigate = useNavigate();
  
    return (
      <header>
        <h1>ShopEase</h1>
        <nav>
          <a href="#">Home</a>
          <a href="#products">Products</a>
          <a href="#about">About</a>
          <a href="#footer">Contact</a>
  
          <input
            type="text"
            placeholder="Search products..."
            className="search-bar"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
  
          <button className="nav-btn" onClick={() => navigate('/cart')}>🛒 Cart</button>
          <button className="nav-btn" onClick={() => navigate('/login')}>Login</button>
        </nav>
      </header>
    );
  };
  
  export default Navbar;