import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaShoppingBag, FaShoppingCart, FaHeart, FaUser, FaBox } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount } = useCart();

  const navItems = [
    { path: '/home', icon: FaHome, label: 'Home' },
    { path: '/products', icon: FaShoppingBag, label: 'Shop' },
    { path: '/cart', icon: FaShoppingCart, label: 'Cart', badge: cartCount },
    { path: '/wishlist', icon: FaHeart, label: 'Wishlist' },
    { path: '/orders', icon: FaBox, label: 'Orders' },
    { path: '/profile', icon: FaUser, label: 'Account' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-soft-lg z-50 safe-area-bottom">
      <div className="grid grid-cols-6 h-16">
        {navItems.map(({ path, icon: Icon, label, badge }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center justify-center transition-all duration-200 ${isActive(path)
                ? 'text-accent scale-105'
                : 'text-text-secondary hover:text-primary'
              }`}
          >
            <div className="relative">
              <Icon size={20} className={isActive(path) ? 'animate-pulse' : ''} />
              {badge > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center animate-bounce">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </div>
            <span className={`text-xs mt-1 font-medium ${isActive(path) ? 'font-semibold' : ''}`}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
