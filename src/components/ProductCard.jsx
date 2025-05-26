import React from 'react';
import '../styles/Home.css'; 

const ProductCard = ({ product }) => {
  return (
    <div className="product" key={product.id}>
      <img src={product.image} alt={product.title} />
      <h3>{product.title}</h3>
      <p>${product.price}</p>
      <button className="add-to-cart-btn">Add to Cart</button>
    </div>
  );
};

export default ProductCard;