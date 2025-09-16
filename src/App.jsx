import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import PaymentStatus from './pages/PaymentStatus';
import OrderConfirmed from './pages/OrderConfirmed';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';
import Products from './pages/Products';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const visited = localStorage.getItem('visited');
    if (!visited) {
      localStorage.setItem('visited', 'true');
      navigate('/welcome');
    }

    const storedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setCartItems(storedCart);
    setWishlistItems(storedWishlist);
  }, [navigate]);

  const addToCart = (product) => {
    const exist = cartItems.find(item => item.id === product.id);
    let updatedCart;
    if (exist) {
      updatedCart = cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      toast.info(`Increased quantity of ${product.title} in cart`);
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
      toast.success(`${product.title} added to cart`);
    }
    setCartItems(updatedCart);
    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
  };

  const toggleWishlist = (product) => {
    const exists = wishlistItems.find(item => item.id === product.id);
    let updatedWishlist;
    if (exists) {
      updatedWishlist = wishlistItems.filter(item => item.id !== product.id);
      toast.info(`${product.title} removed from wishlist`);
    } else {
      updatedWishlist = [...wishlistItems, product];
      toast.success(`${product.title} added to wishlist`);
    }
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              <Routes>
                <Route path="/home" element={<Home addToCart={addToCart} toggleWishlist={toggleWishlist} wishlistItems={wishlistItems} />} />
                <Route path="/products" element={<Products addToCart={addToCart} toggleWishlist={toggleWishlist} wishlistItems={wishlistItems} searchQuery={searchQuery} />} />
                <Route path="/cart" element={
                  <Cart
                    cartItems={cartItems}
                    handleIncrease={(id) => {
                      const product = cartItems.find(item => item.id === id);
                      const updated = cartItems.map(item =>
                        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
                      );
                      setCartItems(updated);
                      localStorage.setItem('cartItems', JSON.stringify(updated));
                      if (product) toast.info(`Increased quantity of ${product.title}`);
                    }}
                    handleDecrease={(id) => {
                      const product = cartItems.find(item => item.id === id);
                      const updated = cartItems.map(item =>
                        item.id === id && item.quantity > 1
                          ? { ...item, quantity: item.quantity - 1 }
                          : item
                      );
                      setCartItems(updated);
                      localStorage.setItem('cartItems', JSON.stringify(updated));
                      if (product) toast.info(`Decreased quantity of ${product.title}`);
                    }}
                    handleRemove={(id) => {
                      const product = cartItems.find(item => item.id === id);
                      const updated = cartItems.filter(item => item.id !== id);
                      setCartItems(updated);
                      localStorage.setItem('cartItems', JSON.stringify(updated));
                      if (product) toast.error(`${product.title} removed from cart`);
                    }}
                  />
                } />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/payment-status" element={<PaymentStatus setCartItems={setCartItems} />} />
                <Route path="/order-confirmed" element={<OrderConfirmed setCartItems={setCartItems} />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/wishlist" element={<Wishlist wishlistItems={wishlistItems} toggleWishlist={toggleWishlist} setCartItems={setCartItems} />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/" element={<Home addToCart={addToCart} toggleWishlist={toggleWishlist} wishlistItems={wishlistItems} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>

              <BottomNav cartItems={cartItems} wishlistItems={wishlistItems} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
