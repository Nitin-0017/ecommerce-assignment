import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';

const OrderConfirmed = ({ setCartItems }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false); 

  useEffect(() => {
    if (!state || saved || state.savedToOrders) return;

    const { cartItems, name, address, phone, totalAmount, paymentMethod } = state;


    localStorage.removeItem("cartItems");
    setCartItems([]);

    const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

    const newOrders = cartItems.map((item) => ({
      id: Date.now() + Math.random(),
      title: item.title,
      image: item.image,
      quantity: item.quantity,
      price: item.price,
      name,
      address,
      phone,
      totalAmount,
      paymentMethod,
      orderDate: new Date().toLocaleString(),
      deliveryDate: "July 7, 2025",
      status: "Processing",
    }));

    const updatedOrders = [...existingOrders, ...newOrders];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    setSaved(true); 
    navigate('/order-confirmed', {
      replace: true,
      state: { ...state, savedToOrders: true }
    });
  }, [state, saved, navigate, setCartItems]);

  if (!state) return <p>Invalid access</p>;

  const { name, address, phone, cartItems, totalAmount, paymentMethod } = state;

  return (
    <>
      <Navbar />
      <div className="payment-status-page">
        <h2>🎉 Thank You! Your Order is Confirmed</h2>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Address:</strong> {address}</p>
        <p><strong>Phone:</strong> {phone}</p>
        <p><strong>Payment Method:</strong> {paymentMethod.toUpperCase()}</p>
        <p><strong>Total Payable:</strong> ₹{totalAmount.toLocaleString()}</p>

        <div style={{ marginTop: '1.5rem' }}>
          {cartItems?.map((item) => (
            <div key={item.id} style={{ marginBottom: '0.75rem' }}>
              <p>{item.title} × {item.quantity} = ₹{(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/orders')} className="check-btn">
          View My Orders
        </button>
      </div>
      <BottomNav />
      <Footer />
    </>
  );
};

export default OrderConfirmed;