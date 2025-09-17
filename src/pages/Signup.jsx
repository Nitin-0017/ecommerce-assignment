import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = () => {
    if (!username || !password) {
      setError('Please fill all fields');
      return;
    }

    
    const user = { username, password };
    localStorage.setItem('registeredUser', JSON.stringify(user));

    alert('Signup successful! Please login now.');
    navigate('/login'); 
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img
          src="https://i.pinimg.com/736x/0c/db/05/0cdb0533cd783fd067534e58050c76e7.jpg"
          alt="Signup Visual"
        />
      </div>
      <form className="login-form" onSubmit={(e) => e.preventDefault()}>
        <h2>Create an Account</h2>

        <label>Username</label>
        <input
          type="text"
          placeholder="Create Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error-msg">{error}</p>}

        <button className="login-btn" onClick={handleSignup}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
