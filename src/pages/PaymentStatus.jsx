import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import Modal from '../components/Modal';

const PaymentStatus = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);

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
      {showModal && (
        <Modal title={success ? "Payment Successful!" : " Payment Failed"} onClose={() => setShowModal(false)}>
          {success && (
            <>
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Address:</strong> {address}</p>
              <p><strong>Phone:</strong> {phone}</p>
              <p><strong>Payment Mode:</strong> {paymentMethod.toUpperCase()}</p>
              {razorpay_payment_id && <p><strong>Payment ID:</strong> {razorpay_payment_id}</p>}
              <p><strong>Total Paid:</strong> ₹{totalAmount.toLocaleString()}</p>
              <div style={{ marginTop: '1rem' }}>
                {cartItems?.map((item) => (
                  <div key={item.id}>
                    <p>{item.title} × {item.quantity} = ₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </>
          )}
          <button className='check-btn' onClick={() => { setShowModal(false); navigate('/home'); }}>Back to Home</button>
        </Modal>
      )}
      <BottomNav/>
      <Footer/>
    </>
  );
};

export default PaymentStatus;
