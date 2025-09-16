import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../utils/auth';
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

    // Save user credentials (mock backend)
    const user = { username, password };
    localStorage.setItem('registeredUser', JSON.stringify(user));

    // Generate a fake JWT token
    const fakeToken = btoa(`${username}:${password}`); // base64 string as token
    setToken(fakeToken);
    localStorage.setItem('username', username);

    navigate('/home');
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
        />

        <label>Create Password</label>
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
