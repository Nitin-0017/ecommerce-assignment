import React from 'react';
import '../styles/Home.css'; 

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="product" key={product.id}>
      <img src={product.image} alt={product.title} />
      <h4>{product.title}</h4>
      <p>${product.price}</p>
      <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;