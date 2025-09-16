import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import '../styles/Wishlist.css';
import { toast } from 'react-toastify';
import EmptyState from "../components/EmptyState";

const Wishlist = ({ wishlistItems, toggleWishlist, setCartItems }) => {

  const moveToCart = (product) => {
    const currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const exist = currentCart.find(item => item.id === product.id);
    let updatedCart;

    if (exist) {
      updatedCart = currentCart.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...currentCart, { ...product, quantity: 1 }];
    }

    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    setCartItems(updatedCart);

    toggleWishlist(product); 
    toast.success(`${product.title} moved to cart 🛒`);
  };

  return (
    <>
      <Navbar />

      <div className="wishlist-page">
        <h2>My Wishlist</h2>
        {wishlistItems.length === 0 ? (
         <EmptyState type="wishlist" />
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map(item => (
              <div key={item.id} className="wishlist-card">
                <img src={item.image} alt={item.title} className="wishlist-img" />
                <div className="wishlist-info">
                  <h4>{item.title}</h4>
                  <p>₹{Math.round(item.price * 83)}</p>
                  <div className="wishlist-btn-group">
                    <button className="move-btn" onClick={() => moveToCart(item)}>Move to Cart</button>
                    <button className="remove-btn" onClick={() => toggleWishlist(item)}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav 
        cartItems={JSON.parse(localStorage.getItem("cartItems")) || []} 
        wishlistItems={wishlistItems} 
      />
      <Footer />
    </>
  );
};

export default Wishlist;
