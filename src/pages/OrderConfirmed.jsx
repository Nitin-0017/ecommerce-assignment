import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import Modal from '../components/Modal';

const OrderConfirmed = ({ setCartItems }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(true);
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

    localStorage.setItem("orders", JSON.stringify([...existingOrders, ...newOrders]));
    setSaved(true);
    navigate('/order-confirmed', { replace: true, state: { ...state, savedToOrders: true } });
  }, [state, saved, navigate, setCartItems]);

  if (!state) return <p>Invalid access</p>;

  const { name, address, phone, cartItems, totalAmount, paymentMethod } = state;

  return (
    <>
      <Navbar />
      {showModal && (
        <Modal title=" Order Confirmed!" onClose={() => setShowModal(false)}>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Phone:</strong> {phone}</p>
          <p><strong>Payment Method:</strong> {paymentMethod.toUpperCase()}</p>
          <p><strong>Total Payable:</strong> ₹{totalAmount.toLocaleString()}</p>
          <div style={{ marginTop: '1rem' }}>
            {cartItems?.map((item) => (
              <p key={item.id}>{item.title} × {item.quantity} = ₹{(item.price * item.quantity).toLocaleString()}</p>
            ))}
          </div>
          <button className="check-btn" onClick={() => { setShowModal(false); navigate('/orders'); }}>
            View My Orders
          </button>
        </Modal>
      )}
      <BottomNav />
      <Footer />
    </>
  );
};

export default OrderConfirmed;
