import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      navigate('/home', { replace: true }); 
    }
  }, [navigate]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem('registeredUser'));

    if (storedUser && username === storedUser.username && password === storedUser.password) {
      localStorage.setItem('username', username);
      localStorage.setItem('isLoggedIn', 'true');
      alert('Successfully logged in');
      navigate('/home');
    } else {
      alert('User not found. Please sign up first.');
      navigate('/signup');
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

        <label style={{ fontSize: "1.2rem" }}>Username</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label style={{ fontSize: "1.2rem" }}>Password</label>
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
