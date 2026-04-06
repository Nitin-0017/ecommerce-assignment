/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { FaTrash, FaPlus, FaMinus, FaGift } from 'react-icons/fa';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import emptyCartAnimation from '../assets/empty-cart.json';

const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    loading,
    updateQuantity,
    removeFromCart,
    selectedItemIds,
    selectedCount,
    toggleSelectItem,
    toggleSelectAll
  } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (productId, productTitle) => {
    try {
      await removeFromCart(productId);
      toast.success(`${productTitle} removed from cart`);
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const calculateSubtotal = () => {
    return cart?.items?.reduce((totalAmount, item) => {
      if (!selectedItemIds.includes(item.product._id)) return totalAmount;
      const price = item.product?.price || 0;
      return totalAmount + (price * item.quantity);
    }, 0) || 0;
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.18;
  const shipping = subtotal > 500 ? 0 : 40;
  const total = subtotal + tax + shipping;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-accent mx-auto mb-4"></div>
          <p className="text-text-secondary text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-white">
        <EmptyState
          animationData={emptyCartAnimation}
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet. Start shopping and add your favorite items!"
          actionLabel="Start Shopping"
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
            Shopping Cart
          </h1>
          {cart?.items?.length > 0 && (
            <div className="mt-4 flex items-center justify-between bg-white/50 backdrop-blur-sm p-4 rounded-apple border border-border">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCount === cart.items.length && cart.items.length > 0}
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                    className="w-6 h-6 rounded-apple-sm border-2 border-border text-slate-900 focus:ring-slate-900 cursor-pointer appearance-none checked:bg-slate-900 checked:border-slate-900 transition-all"
                  />
                  {selectedCount === cart.items.length && cart.items.length > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className="font-semibold text-primary group-hover:text-accent transition-colors">
                  Select All Items ({cart.items.length})
                </span>
              </label>
              <div className="text-sm font-medium text-text-secondary">
                {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((cartItem) => (
                <div key={cartItem.product._id} className="card flex flex-col md:flex-row gap-6 hover:shadow-soft-lg transition-all duration-300 group relative overflow-hidden">
                  { }
                  <div className="flex items-center">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedItemIds.includes(cartItem.product._id)}
                        onChange={() => toggleSelectItem(cartItem.product._id)}
                        className="w-6 h-6 rounded-apple-sm border-2 border-border text-slate-900 focus:ring-slate-900 cursor-pointer appearance-none checked:bg-slate-900 checked:border-slate-900 transition-all"
                      />
                      {selectedItemIds.includes(cartItem.product._id) && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-white">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className="md:w-40 h-40 bg-gray-50 rounded-apple flex items-center justify-center overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/product/${cartItem.product._id}`)}
                  >
                    <img
                      src={cartItem.product.image}
                      alt={cartItem.product.title}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-bold text-xl mb-2 text-primary group-hover:text-accent transition-colors cursor-pointer"
                      onClick={() => navigate(`/product/${cartItem.product._id}`)}
                    >
                      {cartItem.product.title}
                    </h3>
                    <p className="text-black font-bold text-2xl mb-4">
                      ₹{(cartItem.product.price).toFixed(0)}
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center border-2 border-border rounded-apple-sm overflow-hidden">
                        <button
                          onClick={() => handleUpdateQuantity(cartItem.product._id, cartItem.quantity - 1)}
                          className="p-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                          disabled={cartItem.quantity <= 1}
                        >
                          <FaMinus size={14} />
                        </button>
                        <span className="px-6 font-bold text-lg">{cartItem.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(cartItem.product._id, cartItem.quantity + 1)}
                          className="p-3 hover:bg-gray-100 transition-colors"
                        >
                          <FaPlus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemove(cartItem.product._id, cartItem.product.title)}
                        className="text-red-500 hover:text-red-700 transition-colors flex items-center gap-2 font-medium"
                      >
                        <FaTrash size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-2xl text-black">
                      ₹{(cartItem.product.price * cartItem.quantity).toFixed(0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {cart.items.length > itemsPerPage && (
              <div className="mt-6 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-apple-sm bg-white border-2 border-border hover:border-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {[...Array(Math.ceil(cart.items.length / itemsPerPage))].map((_, index) => (
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(cart.items.length / itemsPerPage)))}
                  disabled={currentPage === Math.ceil(cart.items.length / itemsPerPage)}
                  className="px-4 py-2 rounded-apple-sm bg-white border-2 border-border hover:border-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                >
                  Next
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="card sticky top-20 bg-gradient-to-br from-white to-gray-50">
              <h2 className="text-2xl font-bold mb-6 text-primary">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-text-secondary text-lg">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-text-secondary text-lg">
                  <span>Tax (18%)</span>
                  <span className="font-semibold">₹{tax.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-text-secondary text-lg">
                  <span>Shipping</span>
                  <span className="font-semibold">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <div className="bg-accent/10 border border-accent/30 rounded-apple-sm p-3">
                    <p className="text-sm text-accent font-medium flex items-center gap-2">
                      <FaGift className="text-accent" />
                      Add ₹{(500 - subtotal).toFixed(0)} more for FREE shipping!
                    </p>
                  </div>
                )}
                <div className="border-t-2 border-border pt-4">
                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total</span>
                    <span className="text-black">
                      ₹{total.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                fullWidth
                size="lg"
                className="mb-3"
                disabled={selectedCount === 0}
                onClick={() => navigate('/checkout', { state: { selectedItemIds } })}
              >
                Proceed to Checkout {selectedCount > 0 ? `(${selectedCount})` : ''}
              </Button>

              <Button
                onClick={() => navigate('/products')}
                variant="secondary"
                fullWidth
                size="md"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Cart;
