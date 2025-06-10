import React, { useState } from 'react';
import '../styles/Home.css';

const ProductCard = ({ product, addToCart }) => {
  const [showTitle, setShowTitle] = useState(false);

  const handleTitleClick = () => {
    setShowTitle(!showTitle);
  };

  return (
    <div className="product" key={product.id}>
      <img src={product.image} alt="product" />
      <p>${product.price}</p>

      <button onClick={handleTitleClick} className="toggle-title-btn">
        {showTitle ? 'Hide Description' : 'Show Description'}
      </button>

      {showTitle && <h4>{product.title}</h4>}

      <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;