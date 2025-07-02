import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    profilePic: '',
  });

 
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userProfile'));
    if (storedUser) setUser(storedUser);
  }, []);

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

 
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUser(prev => ({ ...prev, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  
  const handleSave = () => {
    localStorage.setItem('userProfile', JSON.stringify(user));
    alert('Profile saved ✅');
  };

  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      <Navbar />

      <div className="profile-page">
        <h2>My Profile</h2>

        <div className="profile-form">
         
          <div className="profile-pic-section">
            <div className="profile-pic-wrapper">
              <img
                src={user.profilePic || '/assets/profile.png'}
                alt="Profile"
                className="profile-pic"
              />
              <button
                className="edit-icon-btn"
                onClick={() => document.getElementById('profilePicInput').click()}
                title="Change Profile Photo"
              >
                <FiEdit size={18} />
              </button>
              <input
                type="file"
                id="profilePicInput"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </div>
          </div>

         
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={user.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={user.email}
            onChange={handleChange}
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={user.phone}
            onChange={handleChange}
          />
          <textarea
            name="address"
            placeholder="Delivery Address"
            value={user.address}
            onChange={handleChange}
            rows={3}
          ></textarea>

          
          <button className="save-btn" onClick={handleSave}>
            Save Profile
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <BottomNav />
      <Footer />
    </>
  );
};

export default Profile;