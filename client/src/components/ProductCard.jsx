import React, { useState, useEffect } from 'react';
import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ProductCard = ({ product, addToCart }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsWishlisted(wishlist.some(item => item.id === product.id));
  }, [product.id]);

  const toggleWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    let updatedList;
    if (isWishlisted) {
      updatedList = wishlist.filter(item => item.id !== product.id);
      toast.info(`${product.title} removed from wishlist`);
    } else {
      updatedList = [...wishlist, product];
      toast.success(`${product.title} added to wishlist`);
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

  const handleAddToCart = () => {
    const itemToAdd = {
      id: product.id,
      title: product.title,
      image: product.image,
      price: Math.round(product.price * 83),
      quantity: 1
    };
    addToCart(itemToAdd);
  };

  return (
    <div className="product cursor-pointer" key={product.id} onClick={() => navigate(`/product/${product.id || product._id}`)}>
      <div className="wishlist-icon" onClick={(e) => { e.stopPropagation(); toggleWishlist(); }}>
        {isWishlisted ? <FaHeart color="red" /> : <FaRegHeart color="gray" />}
      </div>

      <img src={product.image} alt={product.title} />
      <h4 className="hover:text-accent transition-colors">{product.title}</h4>
      <p className="text-[#020617] font-semibold">₹{Math.round(product.price * 83)}</p>

      <div className="rating">
        {renderStars(product.rating?.rate || 0)}{' '}
        <span className="rating-count">({product.rating?.count || 0})</span>
      </div>

      <button className="add-to-cart-btn" onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
