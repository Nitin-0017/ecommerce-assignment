import React from 'react';
import '../styles/Navbar.css'; // optional if you want separate styles

const Navbar = () => {
  return (
    <header>
      <h1>ShopEase</h1>
      <nav>
        <a href="#">Home</a>
        <a href="#products">Products</a>
        <a href="#testimonials">Testimonials</a>
        <a href="#footer">Contact</a>
      </nav>
    </header>
  );
};

export default Navbar;