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
      setError('');
      setSuccess('Signup successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }
  };

  return (
    <div className="login-container">
      <h2>Create an Account</h2>
      <input
        type="text"
        placeholder="Create Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Create Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="error-msg">{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default Signup;