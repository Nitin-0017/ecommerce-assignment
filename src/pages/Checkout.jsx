import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import Modal from '../components/Modal';
import Stepper from '../components/Stepper';



const Checkout = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const cartItems = state?.cartItems || [];

  const steps = ['Cart', 'Checkout', 'Payment', 'Order Confirmed'];

  const [form, setForm] = useState({
    name: '',
    address: '',
    phone: '',
    paymentMethod: 'card',
  });

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const proceedToPayment = () => {
    setShowModal(false);
    navigate('/payment', { state: { ...form, cartItems } });
  };

  return (
    <>
      <Navbar />
      <div className="checkout-page">
        <Stepper steps={steps} currentStep={1} />
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

        {showModal && (
          <Modal title="Confirm Your Order" onClose={() => setShowModal(false)}>
            <p><strong>Name:</strong> {form.name}</p>
            <p><strong>Address:</strong> {form.address}</p>
            <p><strong>Phone:</strong> {form.phone}</p>
            <p><strong>Payment Method:</strong> {form.paymentMethod.toUpperCase()}</p>
            <p><strong>Total:</strong> ₹{cartItems.reduce((t, i) => t + i.price * i.quantity, 0).toLocaleString()}</p>
            <button className="check-btn" onClick={proceedToPayment}>Confirm & Proceed</button>
          </Modal>
        )}
      </div>
      <BottomNav />
      <Footer />
    </>
  );
};

export default Checkout;
