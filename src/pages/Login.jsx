import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const registeredUser = JSON.parse(localStorage.getItem('registeredUser'));

    if (registeredUser?.username === email && registeredUser?.password === password) {
      alert('Successfully logged in ✅');
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', registeredUser.username);
      navigate('/home');
    } else {
      alert('Invalid email or password ❌');
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img
          src="https://i.pinimg.com/736x/10/f2/ec/10f2ec4c254b721976716e60a7708aa9.jpg"
          alt="Login Visual"
        />
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login to SwiftKart</h2>

        <label>Email Address</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="options">
          <label className="remember-me">
            <input type="checkbox" />
            Remember Me
          </label>
          <a href="#" className="forgot-password">Forgot Password?</a>
        </div>

        <button type="submit" className="login-btn">Login</button>
      </form>
    </div>
  );
};

export default Login;