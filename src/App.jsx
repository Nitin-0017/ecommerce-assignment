import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Payment from './pages/Payment';
import Login from './pages/Login.jsx';


function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    const exist = cartItems.find((item) => item.id === product.id);
    if (exist) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
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
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<Home addToCart={addToCart} />} />
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
      <Route path="/payment" element={<Payment />} />
    </Routes>
  );
}

export default App;