import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const ProductCard = ({ product, addToCart }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsWishlisted(wishlist.some(item => item.id === product.id));
  }, [product.id]);

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    let updatedList;
    if (isWishlisted) {
      updatedList = wishlist.filter(item => item.id !== product.id);
    } else {
      updatedList = [...wishlist, product];
    }

    localStorage.setItem("wishlist", JSON.stringify(updatedList));
    setIsWishlisted(!isWishlisted);
  };

  
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} color="#FFD700" />);
    }

    if (halfStar) {
      stars.push(<FaStarHalfAlt key="half" color="#FFD700" />);
    }

    while (stars.length < 5) {
      stars.push(<FaRegStar key={`empty-${stars.length}`} color="#ccc" />);
    }

    return stars;
  };

  return (
    <div className="product" key={product.id}>
      <div className="wishlist-icon" onClick={toggleWishlist}>
        {isWishlisted ? <FaHeart color="red" /> : <FaRegHeart color="gray" />}
      </div>

      <img src={product.image} alt={product.title} />
      <h4>{product.title}</h4>
      <p>₹{Math.round(product.price * 83)}</p> 

     
      <div className="rating">
        {renderStars(product.rating?.rate || 0)}{' '}
        <span className="rating-count">({product.rating?.count || 0})</span>
      </div>

      <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;