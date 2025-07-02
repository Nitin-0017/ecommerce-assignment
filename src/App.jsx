import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

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

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const visited = localStorage.getItem('visited');
    if (!visited) {
      localStorage.setItem('visited', 'true');
      navigate('/welcome');
    }
  }, [navigate]);

  const addToCart = (product) => {
    const exist = cartItems.find((item) => item.id === product.id);
    if (exist) {
      setCartItems(cartItems.map((item) =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const handleIncrease = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrease = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemove = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <>
      <Routes>
       
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        
        <Route
          path="/*"
          element={
            <>
              <Navbar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <Routes>
                <Route path="/home" element={<Home addToCart={addToCart} />} />
                <Route
                  path="/products"
                  element={
                    <Products
                      addToCart={addToCart}
                      searchQuery={searchQuery}
                    />
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <Cart
                      cartItems={cartItems}
                      handleIncrease={handleIncrease}
                      handleDecrease={handleDecrease}
                      handleRemove={handleRemove}
                    />
                  }
                />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment" element={<Payment />} />
                <Route
                  path="/payment-status"
                  element={<PaymentStatus setCartItems={setCartItems} />}
                />
                <Route
                  path="/order-confirmed"
                  element={<OrderConfirmed setCartItems={setCartItems} />}
                />
                <Route path="/orders" element={<Orders />} />
                <Route
                  path="/wishlist"
                  element={<Wishlist setCartItems={setCartItems} />}
                />
                <Route path="/profile" element={<Profile />} />
                <Route path="/" element={<Home addToCart={addToCart} />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </>
  );
}

export default App;