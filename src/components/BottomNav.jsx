import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaHeart, FaUser, FaBox } from 'react-icons/fa';
import '../styles/BottomNav.css';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-nav">
      <div className={`nav-icon ${isActive('/home') ? 'active' : ''}`} onClick={() => navigate('/home')}>
        <FaHome />
        <span>Home</span>
      </div>
      <div className={`nav-icon ${isActive('/orders') ? 'active' : ''}`} onClick={() => navigate('/orders')}>
        <FaBox />
        <span>Orders</span>
      </div>
      <div className={`nav-icon ${isActive('/wishlist') ? 'active' : ''}`} onClick={() => navigate('/wishlist')}>
        <FaHeart />
        <span>Wishlist</span>
      </div>
      <div className={`nav-icon ${isActive('/profile') ? 'active' : ''}`} onClick={() => navigate('/profile')}>
        <FaUser />
        <span>Profile</span>
      </div>
      <div className={`nav-icon ${isActive('/cart') ? 'active' : ''}`} onClick={() => navigate('/cart')}>
        <FaShoppingCart />
        <span>Cart</span>
      </div>
    </nav>
  );
};

export default BottomNav;