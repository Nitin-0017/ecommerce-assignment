import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaShoppingCart, FaHeart, FaUser, FaBox } from 'react-icons/fa';
import '../styles/BottomNav.css';

const BottomNav = ({ cartItems = [], wishlistItems = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [totalCartItems, setTotalCartItems] = useState(0);

  useEffect(() => {
    const total = (cartItems || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
    setTotalCartItems(total);
  }, [cartItems]);

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
        {(wishlistItems || []).length > 0 && <span className="badge">{wishlistItems.length}</span>}
        <span>Wishlist</span>
      </div>

      <div className={`nav-icon ${isActive('/profile') ? 'active' : ''}`} onClick={() => navigate('/profile')}>
        <FaUser />
        <span>Profile</span>
      </div>

      <div className={`nav-icon ${isActive('/cart') ? 'active' : ''}`} onClick={() => navigate('/cart')}>
        <FaShoppingCart />
        {totalCartItems > 0 && <span className="badge">{totalCartItems}</span>}
        <span>Cart</span>
      </div>
    </nav>
  );
};

export default BottomNav;
