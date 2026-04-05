import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes, FaBell, FaBellSlash } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import NotificationDrawer from './NotificationDrawer';
import { notificationService } from '../services/notificationService';
import { productService } from '../services/productService';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();
  const { user } = useAuth();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = React.useRef(null);

  useEffect(() => {
    let interval;
    if (user) {
      fetchInitialUnreadCount();
      interval = setInterval(fetchInitialUnreadCount, 60000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await productService.getProducts({ search: searchQuery, limit: 6 });
        setSuggestions(response.products || []);
        setShowSuggestions(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchInitialUnreadCount = async () => {
    try {
      const data = await notificationService.getNotifications();
      const unread = data.notifications.filter(n => !n.isRead).length;
      setUnreadNotifications(unread);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const isMuted = user && user.notifications?.orderUpdates === false;

  const handleNavigate = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product) => {
    navigate(`/product/${product._id}`);
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-primary text-white shadow-soft-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link to="/home" className="text-2xl font-bold hover:text-accent transition-colors">
            SwiftKart
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/home"
              className={`hover:text-accent transition-colors ${isActive('/home') ? 'text-accent' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`hover:text-accent transition-colors ${isActive('/products') ? 'text-accent' : ''}`}
            >
              Products
            </Link>
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8 relative" ref={searchRef}>
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 pr-10 rounded-apple-sm bg-primary-light text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent border border-transparent transition-all"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes size={14} />
                </button>
              )}
            </div>

            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-apple-md shadow-2xl border border-gray-100 overflow-hidden z-50 py-2"
                >
                  {suggestions.map((product, index) => (
                    <div
                      key={product._id}
                      onClick={() => handleSuggestionClick(product)}
                      className={`flex items-center gap-4 px-4 py-3 cursor-pointer transition-colors ${selectedIndex === index ? 'bg-gray-100' : 'hover:bg-gray-50'
                        }`}
                    >
                      <div className="w-12 h-12 bg-gray-50 rounded-apple-xs flex items-center justify-center overflow-hidden flex-shrink-0">
                        <img src={product.image} alt="" className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate">{product.title}</h4>
                        <p className="text-xs text-accent font-bold">₹{(product.price * 83).toFixed(0)}</p>
                      </div>
                    </div>
                  ))}
                  <div
                    onClick={handleSearch}
                    className="px-4 py-2 border-t border-gray-100 mt-2 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer flex justify-center"
                  >
                    <span className="text-xs font-bold text-primary italic">View all results for "{searchQuery}"</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => navigate('/cart')}
              className="relative hover:text-accent transition-colors"
            >
              <FaShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              className={`relative transition-colors ${isMuted ? 'text-gray-400 hover:text-gray-300' : 'hover:text-accent'}`}
              title={isMuted ? 'Notifications muted' : 'Notifications'}
            >
              {isMuted ? <FaBellSlash size={18} /> : <FaBell size={18} />}
              {!isMuted && unreadNotifications > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="hover:text-accent transition-colors"
            >
              <FaUser size={18} />
            </button>
          </div>

          <NotificationDrawer
            isOpen={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            onUnreadCountChange={setUnreadNotifications}
          />

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden hover:text-accent transition-colors"
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-2 pl-10 rounded-apple-sm bg-primary-light text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
            </form>

            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleNavigate('/home')}
                className={`text-left py-2 hover:text-accent transition-colors ${isActive('/home') ? 'text-accent' : ''}`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavigate('/products')}
                className={`text-left py-2 hover:text-accent transition-colors ${isActive('/products') ? 'text-accent' : ''}`}
              >
                Products
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
