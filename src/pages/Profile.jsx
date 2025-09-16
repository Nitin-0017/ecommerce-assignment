import React, { useState, useEffect } from 'react';
import { FiEdit, FiLogOut, FiBell, FiMapPin, FiLock } from 'react-icons/fi';
import '../styles/Profile.css';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    username: '',
    gender: 'Male',
    phone: '',
    email: '',
    profilePic: '',
  });

  const [activeSection, setActiveSection] = useState("overview");

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
    setActiveSection("overview");
    alert('Profile saved');
  };

  const handleSignOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  // ---- Different Sections ----
  if (activeSection === "edit") {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <button className="back-btn" onClick={() => setActiveSection("overview")}>← Back</button>
          <h2>Edit Profile</h2>
          <input type="text" name="name" value={user.name} onChange={handleChange} placeholder="Name" />
          <input type="text" name="username" value={user.username} onChange={handleChange} placeholder="Username" />
          <select name="gender" value={user.gender} onChange={handleChange}>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
          <input type="tel" name="phone" value={user.phone} onChange={handleChange} placeholder="Phone Number" />
          <input type="email" name="email" value={user.email} onChange={handleChange} placeholder="Email" />
          <button className="save-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    );
  }

  if (activeSection === "notifications") {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <button className="back-btn" onClick={() => setActiveSection("overview")}>← Back</button>
          <h2>Notifications</h2>
          <p>You don’t have any notifications yet.</p>
        </div>
      </div>
    );
  }

  if (activeSection === "shipping") {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <button className="back-btn" onClick={() => setActiveSection("overview")}>← Back</button>
          <h2>Shipping Address</h2>
          <input type="text" placeholder="Enter your address" />
          <button className="save-btn">Save Address</button>
        </div>
      </div>
    );
  }

  if (activeSection === "password") {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <button className="back-btn" onClick={() => setActiveSection("overview")}>← Back</button>
          <h2>Change Password</h2>
          <input type="password" placeholder="Old Password" />
          <input type="password" placeholder="New Password" />
          <input type="password" placeholder="Confirm New Password" />
          <button className="save-btn">Update Password</button>
        </div>
      </div>
    );
  }

  
  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-pic-wrapper">
          <img
            src={user.profilePic || '/assets/profile.png'}
            alt="Profile"
            className="profile-pic"
          />
          <label htmlFor="profilePicInput" className="edit-icon-btn"><FiEdit /></label>
          <input
            type="file"
            id="profilePicInput"
            style={{ display: 'none' }}
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <h2>{user.name || 'Your Name'}</h2>
        <p>Buyer</p>

        <div className="profile-options">
          <div onClick={() => setActiveSection("edit")}><FiEdit /> Edit Profile</div>
          <div onClick={() => setActiveSection("notifications")}><FiBell /> Notifications</div>
          <div onClick={() => setActiveSection("shipping")}><FiMapPin /> Shipping Address</div>
          <div onClick={() => setActiveSection("password")}><FiLock /> Change Password</div>
        </div>

        <button className="signout-btn" onClick={handleSignOut}><FiLogOut /> Sign Out</button>
      </div>
    </div>
  );
};

export default Profile;
