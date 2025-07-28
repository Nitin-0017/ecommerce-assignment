import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../styles/Checkout.css"
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';

const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const cartItems = state?.cartItems || [];

  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    paymentMethod: 'card',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/payment', { state: { ...form, cartItems } });
  };

  return (
<>
     <Navbar />

    <div className="checkout-page">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" type="text" placeholder="Full Name" required onChange={handleChange} />
        <input name="address" type="text" placeholder="Address" required onChange={handleChange} />
        <input name="phone" type="tel" placeholder="Phone Number" required onChange={handleChange} />

        <label>Payment Method:</label>
        <select name="paymentMethod" onChange={handleChange}>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
          <option value="cod">Cash on Delivery</option>
        </select>

        <button type="submit" className='check-btn'>Proceed to Pay</button>
      </form>
    </div>
    <BottomNav/>
    <Footer/>
    </>
  );
};

export default Checkout;