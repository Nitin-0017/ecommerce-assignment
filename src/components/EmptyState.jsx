import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import '../styles/EmptyState.css';


import emptyCartAnim from "../assets/empty-cart.json";
import emptyOrdersAnim from "../assets/empty-orders.json";
import emptyWishlistAnim from "../assets/empty-wishlist.json";

const EmptyState = ({ type }) => {
  const navigate = useNavigate();

  const content = {
    cart: {
      animation: emptyCartAnim,
      title: "Your Cart is Empty ",
      subtitle: "Looks like you haven’t added anything yet.",
      btnText: "Shop Now",
      btnAction: () => navigate("/products"),
    },
    orders: {
      animation: emptyOrdersAnim,
      title: "No Orders Found ",
      subtitle: "Place your first order and track it here.",
      btnText: "Start Shopping",
      btnAction: () => navigate("/products"),
    },
    wishlist: {
      animation: emptyWishlistAnim,
      title: "Your Wishlist is Empty ",
      subtitle: "Save items you love to see them here.",
      btnText: "Browse Products",
      btnAction: () => navigate("/products"),
    },
  };

  const { animation, title, subtitle, btnText, btnAction } = content[type];

  return (
    <div className="empty-state">
      <Lottie animationData={animation} loop={true} className="empty-lottie" />
      <h2>{title}</h2>
      <p>{subtitle}</p>
      <button onClick={btnAction}>{btnText}</button>
    </div>
  );
};

export default EmptyState;
