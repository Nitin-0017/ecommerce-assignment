import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="login-container">
      <div className="login-form" style={{ textAlign: 'center' }}>
        <h2>Welcome to SwiftKart</h2>
        <p>Do you already have an account?</p>
        <button className="login-btn" onClick={() => navigate('/login')}>Yes, Log In</button>
        <button className="login-btn" style={{ marginTop: '20px' }} onClick={() => navigate('/signup')}>No, Sign Up</button>
      </div>
    </div>
  );
};

export default Welcome;