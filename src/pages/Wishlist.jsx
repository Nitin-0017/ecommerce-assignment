import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import '../styles/Wishlist.css';

const Wishlist = ({ setCartItems }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  const removeFromWishlist = (id) => {
    const updated = wishlist.filter(item => item.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  const moveToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];

    const exist = currentCart.find(item => item.id === product.id);
    let updatedCart;

    if (exist) {
      updatedCart = currentCart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...currentCart, { ...product, quantity: 1 }];
    }

    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    removeFromWishlist(product.id);
  };

  return (
    <>
      <Navbar />

      <div className="wishlist-page">
        <h2>My Wishlist</h2>

        {wishlist.length === 0 ? (
          <p className="empty-msg">Your wishlist is empty.</p>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map((item) => (
              <div key={item.id} className="wishlist-card">
                <img src={item.image} alt={item.title} className="wishlist-img" />

                <div className="wishlist-info">
                  <h4>{item.title}</h4>
                  <p>₹{item.price}</p>

                  <div className="wishlist-btn-group">
                    <button className="move-btn" onClick={() => moveToCart(item)}>
                      Move to Cart
                    </button>
                    <button className="remove-btn" onClick={() => removeFromWishlist(item.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
      <Footer />
    </>
  );
};

export default Wishlist;