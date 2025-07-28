import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import { useNavigate } from 'react-router-dom';
import "../styles/Cart.css";

const Cart = ({ cartItems, handleIncrease, handleDecrease, handleRemove }) => {
  const navigate = useNavigate();

  const handleBuyNow = () => {
    navigate('/checkout', { state: { cartItems } });
  };

  const getTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <>
      <Navbar />

      <section className="section cart-section">
        <h2>Your Shopping Cart</h2>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} />
                <div className="cart-info">
                  <h4>{item.title}</h4>
                  <p>₹{item.price.toLocaleString()}</p>

                  <div className="quantity-controls">
                    <button onClick={() => handleDecrease(item.id)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleIncrease(item.id)}>+</button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => handleRemove(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <hr />
            <h3>Total: ₹{getTotal().toLocaleString()}</h3>
          </div>
        )}

        {cartItems.length > 0 && (
          <div className="buy-now-container">
            <button
              className="buy-now-btn"
              onClick={handleBuyNow}
              style={{
                marginTop: '2rem',
                padding: '12px 30px',
                fontSize: '1.2rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#218838')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '#28a745')}
            >
              Buy Now
            </button>
          </div>
        )}
      </section>
        <BottomNav/>
      <Footer />
    </>
  );
};

export default Cart;