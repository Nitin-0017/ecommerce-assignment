import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import emptyWishlistAnimation from '../assets/empty-wishlist.json';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  }, []);

  const removeFromWishlist = (productId) => {
    const updated = wishlist.filter(item => item._id !== productId);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-white">
        <EmptyState
          animationData={emptyWishlistAnimation}
          title="Your wishlist is empty"
          description="Save your favorite items here and never lose track of what you love!"
          actionLabel="Discover Products"
          onAction={() => navigate('/products')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-white py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Wishlist
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlist.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((product) => (
            <div
              key={product._id}
              className="card group hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <div className="relative overflow-hidden rounded-apple mb-4 bg-gray-50">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-64 object-contain group-hover:scale-110 transition-transform duration-500"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); removeFromWishlist(product._id); }}
                  className="absolute top-3 right-3 bg-white hover:bg-red-50 text-red-500  rounded-full p-2 shadow-soft transition-all"
                >
                  <FaTrash size={16} />
                </button>
              </div>
              <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-accent transition-colors">
                {product.title}
              </h3>
              <p className="text-3xl font-bold text-[#020617] mb-4">
                ₹{(product.price * 83).toFixed(0)}
              </p>
              <Button
                onClick={(e) => { e.stopPropagation(); navigate('/cart'); }}
                variant="primary"
                fullWidth
                size="sm"
              >
                <FaShoppingCart className="mr-2" />
                Add to Cart
              </Button>
            </div>
          ))}
        </div>

        { }
        {wishlist.length > itemsPerPage && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-apple-sm bg-white border-2 border-border hover:border-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
            >
              Previous
            </button>

            <div className="flex gap-1">
              {[...Array(Math.ceil(wishlist.length / itemsPerPage))].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`w-10 h-10 rounded-apple-sm font-semibold transition-all ${currentPage === index + 1
                    ? 'bg-slate-900 text-white shadow-soft'
                    : 'bg-white border-2 border-border hover:border-slate-900'
                    }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(wishlist.length / itemsPerPage)))}
              disabled={currentPage === Math.ceil(wishlist.length / itemsPerPage)}
              className="px-4 py-2 rounded-apple-sm bg-white border-2 border-border hover:border-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
