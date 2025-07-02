import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';

const PaymentStatus = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (state?.success) {
      localStorage.removeItem("cartItems"); 
    }
  }, [state]);

  if (!state) return <p>Invalid access</p>;

  const { success, cartItems, name, address, phone, totalAmount, paymentMethod, razorpay_payment_id } = state;

  return (
    <>
      <Navbar />
      <div className="payment-status-page">
        <h2>{success ? "✅ Payment Successful!" : "❌ Payment Failed"}</h2>

        {success && (
          <>
            <h3>Order Summary</h3>
            <p><strong>Name:</strong> {name}</p>
            <p><strong>Address:</strong> {address}</p>
            <p><strong>Phone:</strong> {phone}</p>
            <p><strong>Payment Mode:</strong> {paymentMethod.toUpperCase()}</p>
            {razorpay_payment_id && <p><strong>Payment ID:</strong> {razorpay_payment_id}</p>}
            <p><strong>Total Paid:</strong> ₹{totalAmount.toLocaleString()}</p>

            <div style={{ marginTop: '1.5rem' }}>
              {cartItems?.map((item) => (
                <div key={item.id} style={{ marginBottom: '0.75rem' }}>
                  <p>{item.title} × {item.quantity} = ₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </>
        )}

        <button onClick={() => navigate('/home')} className='check-btn'>Back to Home</button>
      </div>
      <BottomNav/>
      <Footer />
    </>
  );
};

export default PaymentStatus;