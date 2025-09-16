import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken, getToken } from '../utils/auth'; // keep both imports
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (getToken()) {
      navigate('/home');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const validEmail = "Nitin";
    const validPassword = "1234";

    if (email === validEmail && password === validPassword) {
      // Save token in localStorage
      setToken('your_jwt_token_here'); // You can generate a real JWT later
      localStorage.setItem('username', email);
      alert('Successfully logged in');
      navigate('/home');
    } else {
      alert('Invalid email or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img
          src="https://i.pinimg.com/736x/69/3b/84/693b84248ef6402be1159130dc52a684.jpg"
          alt="Login Visual"
        />
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login to SwiftKart</h2>

        <label style={{fontSize:"1.2rem"}}>Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label style={{fontSize:"1.2rem"}}>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        
        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
};

export default Login;
