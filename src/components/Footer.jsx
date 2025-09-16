import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
      
        <div className="footer-section">
          <h2 className="footer-title" style={{color:"white",fontSize:"25px"}}>SwiftKart</h2>
          <p style={{color:"white"}}>Your one-stop destination for quality products at affordable prices. Shop with ease, shop with confidence.</p>
        </div>

        <div className="footer-section">
          
          <ul>
            <li>Home</li>
            <li>Products</li>
            <li>About Us</li>
            <li>Contact</li>
          </ul>
        </div>

      
        <div className="footer-section">
         
          <ul>
            <li>FAQ</li>
            <li>Shipping Policy</li>
            <li>Returns & Refunds</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

       
        <div className="footer-section" >
         
          <p style={{color:"white"}}>📍 123 Commerce Street, Shopping District, SH 10001</p>
          <p style={{color:"white"}}>📞 (123) 456-7890</p>
          <p style={{color:"white"}}>✉️ support@swiftkart.com</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p style={{color:"white"}}>&copy; 2025 SwiftKart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;