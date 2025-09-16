import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import Stepper from '../components/Stepper';
import '../styles/Checkout.css';

const PaymentStatus = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const steps = ['Cart', 'Checkout', 'Payment', 'Order Confirmed'];

  useEffect(() => {
    if (state?.success) localStorage.removeItem("cartItems");
  }, [state]);

  if (!state) return <p style={{ paddingTop: "6rem", textAlign: "center" }}>Invalid access</p>;

  const { success, cartItems, name, address, phone, totalAmount, paymentMethod, razorpay_payment_id } = state;

  return (
    <>
      <Navbar />
      <div className="payment-status-page">
        <Stepper steps={steps} currentStep={3} />

        {success ? (
          <div className="order-confirmation">
            <h2> Thank you for placing your order!</h2>
            <p className="subtitle">We’ve received your order and it’s being processed.</p>

            <div className="order-summary">
              <h3>Order Summary</h3>
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Address:</strong> {address}</p>
              <p><strong>Phone:</strong> {phone}</p>
              <p><strong>Payment Mode:</strong> {paymentMethod.toUpperCase()}</p>
              {razorpay_payment_id && <p><strong>Payment ID:</strong> {razorpay_payment_id}</p>}
              <p><strong>Total Paid:</strong> ₹{totalAmount.toLocaleString()}</p>

              <div className="cart-items-summary">
                {cartItems?.map((item) => (
                  <div key={item.id} className="order-item">
                    <span>{item.title}</span>
                    <span>{item.quantity} × ₹{item.price.toLocaleString()}</span>
                    <span>= ₹{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="check-btn"
              style={{ marginTop: '2rem' }}
              onClick={() => navigate('/home')}
            >
              Back to Home
            </button>
          </div>
        ) : (
          <div className="order-failed">
            <h2>Payment Failed</h2>
            <p>Please try again or choose another payment method.</p>
            <button className="check-btn" onClick={() => navigate('/checkout')}>
              Retry Payment
            </button>
          </div>
        )}
      </div>
      <BottomNav />
      <Footer />
    </>
  );
};

export default PaymentStatus;
