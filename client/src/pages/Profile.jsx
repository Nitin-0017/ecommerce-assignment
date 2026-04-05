import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { orderService } from '../services/orderService';
import { cartService } from '../services/cartService';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSignOutAlt, FaEdit, FaSave, FaTimes, FaBox, FaHeart, FaShoppingCart, FaCreditCard, FaBell, FaBellSlash } from 'react-icons/fa';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    notifications: {
      orderUpdates: true
    }
  });
  const [stats, setStats] = useState([
    { label: 'Orders', value: '0', icon: FaBox, color: 'from-blue-500 to-blue-600' },
    { label: 'Wishlist', value: '0', icon: FaHeart, color: 'from-pink-500 to-pink-600' },
    { label: 'Cart', value: '0', icon: FaShoppingCart, color: 'from-green-500 to-green-600' }
  ]);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        notifications: user.notifications || { orderUpdates: true }
      });
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const [ordersData, cartData] = await Promise.all([
        orderService.getOrders(),
        cartService.getCart()
      ]);

      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');

      setStats([
        { label: 'Orders', value: ordersData.count || 0, icon: FaBox, color: 'from-blue-500 to-blue-600' },
        { label: 'Wishlist', value: wishlist.length, icon: FaHeart, color: 'from-pink-500 to-pink-600' },
        { label: 'Cart', value: cartData.cart?.items?.length || 0, icon: FaShoppingCart, color: 'from-green-500 to-green-600' }
      ]);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await userService.updateProfile(profileData);
      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleToggleNotification = async () => {
    try {
      const newValue = !profileData.notifications.orderUpdates;
      setProfileData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          orderUpdates: newValue
        }
      }));

      await userService.updateNotifications({ orderUpdates: newValue });
      toast.success(`Notifications ${newValue ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update notification preferences');
      // Rollback on error
      setProfileData(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          orderUpdates: !prev.notifications.orderUpdates
        }
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-white py-8">
      <div className="container-custom max-w-4xl">
        { }
        <div className="card mb-8 bg-gradient-to-r from-primary to-accent text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-5xl text-black shadow-soft-lg">
              {profileData.name?.charAt(0).toUpperCase() || ''}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{profileData.name || 'User'}</h1>
              <p className="text-gray-100 flex items-center gap-2">
                <FaEnvelope size={14} />
                {profileData.email}
              </p>
            </div>
            {!editing && (
              <Button
                onClick={() => setEditing(true)}
                variant="secondary"
                className="bg-white text-black hover:bg-gray-100 border-none shadow-none"
              >
                <FaEdit className="mr-2 text-black" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        { }
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="card text-center hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="w-14 h-14 mx-auto mb-2 bg-gray-100 rounded-full flex items-center justify-center">
                <stat.icon className="text-black text-2xl" />
              </div>
              <p className="text-2xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>

        { }
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <FaUser className="text-accent" />
              Personal Information
            </h2>
            {editing && (
              <div className="flex gap-2">
                <Button
                  onClick={() => setEditing(false)}
                  variant="secondary"
                  size="sm"
                >
                  <FaTimes className="mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  variant="primary"
                  size="sm"
                  loading={loading}
                >
                  <FaSave className="mr-2" />
                  Save
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              disabled={!editing}
              icon={FaUser}
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={profileData.email}
              disabled
              icon={FaEnvelope}
              helperText="Email cannot be changed"
            />
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={profileData.phone}
              onChange={handleChange}
              disabled={!editing}
              icon={FaPhone}
            />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <FaBell className="text-accent" />
            Notification Settings
          </h2>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-apple-lg border border-border group hover:border-accent transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${profileData.notifications.orderUpdates ? 'bg-accent/10 text-accent' : 'bg-gray-200 text-gray-500'}`}>
                <FaBell size={20} />
              </div>
              <div>
                <p className="font-bold text-lg">Order Status Updates</p>
                <p className="text-sm text-text-secondary">Get notified when your order status changes</p>
              </div>
            </div>
            <button
              onClick={handleToggleNotification}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${profileData.notifications.orderUpdates ? 'bg-accent' : 'bg-gray-300'}`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${profileData.notifications.orderUpdates ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>
        </div>

        { }
        <div className="card">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/orders')}
              className="card hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaBox className="text-black text-xl" />
                </div>
                <div>
                  <p className="font-bold text-lg">My Orders</p>
                  <p className="text-sm text-text-secondary">Track your orders</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/wishlist')}
              className="card hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaHeart className="text-black text-xl" />
                </div>
                <div>
                  <p className="font-bold text-lg">Wishlist</p>
                  <p className="text-sm text-text-secondary">View saved items</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/cart')}
              className="card hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaShoppingCart className="text-black text-xl" />
                </div>
                <div>
                  <p className="font-bold text-lg">Shopping Cart</p>
                  <p className="text-sm text-text-secondary">View cart items</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/payment-methods')}
              className="card hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FaCreditCard className="text-black text-xl" />
                </div>
                <div>
                  <p className="font-bold text-lg">Payment Methods</p>
                  <p className="text-sm text-text-secondary">Manage saved cards & UPI</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        { }
        <div className="mt-8 text-center">
          <Button
            onClick={handleLogout}
            variant="secondary"
            size="lg"
            className="text-red-600 hover:bg-red-50 border-red-200"
          >
            <FaSignOutAlt className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
