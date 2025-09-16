import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import BottomNav from '../components/BottomNav';
import Stepper from '../components/Stepper';
import '../styles/Checkout.css';

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { name, address, phone, paymentMethod, cartItems } = state || {};
  const steps = ['Cart', 'Checkout', 'Payment', 'Order Confirmed'];

  const totalAmount = cartItems?.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePayment = () => {
    if (paymentMethod === 'cod') {
      navigate('/order-confirmed', { state: { cartItems, name, address, phone, totalAmount, paymentMethod } });
      return;
    }

    const options = {
      key: "rzp_test_1DP5mmOlF5G5ag",
      amount: totalAmount * 100,
      currency: "INR",
      name: "Shopease",
      description: "Order Payment",
      handler: function (response) {
        navigate('/payment-status', { state: { success: true, cartItems, name, address, phone, totalAmount, paymentMethod, razorpay_payment_id: response.razorpay_payment_id } });
      },
      prefill: { name, contact: phone },
      theme: { color: "#3399cc" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <>
      <Navbar />
      <div className="payment-page">
        <Stepper steps={steps} currentStep={2} />
        <h2>Complete Payment</h2>
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Method:</strong> {paymentMethod?.toUpperCase()}</p>
        <p><strong>Total:</strong> ₹{totalAmount?.toLocaleString()}</p>

        {paymentMethod === 'card' && <p>Click below to pay via card using Razorpay.</p>}
        {paymentMethod === 'upi' && <p>Click below to pay via UPI using Razorpay.</p>}
        {paymentMethod === 'cod' && <p>You will pay at the time of delivery.</p>}

        <button onClick={handlePayment} className='check-btn'>Pay Now</button>
      </div>
      <BottomNav />
      <Footer />
    </>
  );
};

export default Payment;
