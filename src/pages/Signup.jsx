import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = () => {
    if (!username || !password) {
      setError('Please fill all fields');
      setSuccess('');
    } else {
      localStorage.setItem('registeredUser', JSON.stringify({ username, password }));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      setError('');
      setSuccess('Signup successful! Redirecting to home...');
      setTimeout(() => {
        navigate('/home');
      }, 1000);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img
          src="https://i.pinimg.com/736x/10/f2/ec/10f2ec4c254b721976716e60a7708aa9.jpg"
          alt="Signup Visual"
        />
      </div>
      <form className="login-form" onSubmit={(e) => e.preventDefault()}>
        <h2>Create an Account</h2>

        <label>Create Username</label>
        <input
          type="text"
          placeholder="Create Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />

        <label>Create Password</label>
        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        {error && <p className="error-msg">{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button className="login-btn" onClick={handleSignup}>Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;