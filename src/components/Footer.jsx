import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-section">
          <h2 className="footer-title">ShopEase</h2>
          <p>Your one-stop destination for quality products at affordable prices. Shop with ease, shop with confidence.</p>
        </div>

        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>Home</li>
            <li>Products</li>
            <li>About Us</li>
            <li>Contact</li>
            <li>Blog</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Customer Service</h3>
          <ul>
            <li>FAQ</li>
            <li>Shipping Policy</li>
            <li>Returns & Refunds</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>📍 123 Commerce Street, Shopping District, SH 10001</p>
          <p>📞 (123) 456-7890</p>
          <p>✉️ support@shopease.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 ShopEase. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;