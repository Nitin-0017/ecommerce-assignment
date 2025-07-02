import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import '../styles/orders.css';
import { FaTrashAlt, FaUndoAlt } from 'react-icons/fa'; 
import ReturnModal from './ReturnModal'; 

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    setOrders(storedOrders.reverse());
  }, []);

  const handleCancel = (id) => {
    const confirmed = window.confirm("Are you sure you want to cancel this order?");
    if (confirmed) {
      const updated = orders.filter((o) => o.id !== id);
      setOrders(updated);
      localStorage.setItem("orders", JSON.stringify(updated));
    }
  };

  const openReturnModal = (id) => {
    setSelectedOrderId(id);
    setShowReturnModal(true);
  };

  return (
    <>
      <Navbar />
      <div className="orders-page">
        <h2 className="orders-heading"> My Orders</h2>

        {orders.length === 0 ? (
          <p className="no-orders">You have no recent orders.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order, index) => (
              <div className="order-card" key={index}>
                <img src={order.image} alt={order.title} className="order-image" />

                <div className="order-info">
                  <h4 className="order-title">{order.title}</h4>
                  <p>Qty: {order.quantity}</p>
                  <p>Total: ₹{order.price * order.quantity}</p>
                  <p>Payment: {order.paymentMethod}</p>
                  <p>Status: <span className="status-badge">Processing</span></p>
                  <p className="order-date">{order.orderDate}</p>
                </div>

                <div className="order-actions">
                  <FaUndoAlt
                    title="Return"
                    className="order-icon return"
                    onClick={() => openReturnModal(order.id)}
                  />
                  <FaTrashAlt
                    title="Cancel"
                    className="order-icon cancel"
                    onClick={() => handleCancel(order.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
      <Footer />

     
      {showReturnModal && (
        <ReturnModal
          onClose={() => setShowReturnModal(false)}
          orderId={selectedOrderId}
        />
      )}
    </>
  );
};

export default Orders;