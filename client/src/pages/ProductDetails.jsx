import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaShoppingCart, FaHeart, FaRegHeart, FaTruck,
    FaChevronRight, FaStar, FaPlus, FaMinus, FaRegClock,
    FaArrowLeft, FaCheckCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import StarRating from '../components/ui/StarRating';
import ProductDetailsSkeleton from '../components/ui/ProductDetailsSkeleton';
import EmptyState from '../components/ui/EmptyState';

const ProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        const loadProductData = async () => {
            try {
                setLoading(true);
                const [productData, relatedData, reviewsData] = await Promise.all([
                    productService.getProductById(productId),
                    productService.getRelatedProducts(productId),
                    productService.getProductReviews(productId)
                ]);

                if (productData.success) {
                    setProduct(productData.product);
                }
                if (relatedData.success) {
                    setRelatedProducts(relatedData.products);
                }
                if (reviewsData.success) {
                    setReviews(reviewsData.reviews);
                }
            } catch (error) {
                console.error('Error loading product details:', error);
                toast.error('Failed to load product details');
            } finally {
                setLoading(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        loadProductData();

        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setIsWishlisted(wishlist.some(item => item._id === productId));
    }, [productId]);

    const toggleWishlist = () => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        let updatedList;

        if (isWishlisted) {
            updatedList = wishlist.filter(item => item._id !== productId);
            toast.info(`${product.title} removed from wishlist`);
        } else {
            updatedList = [...wishlist, product];
            toast.success(`${product.title} added to wishlist`);
        }

        localStorage.setItem('wishlist', JSON.stringify(updatedList));
        setIsWishlisted(!isWishlisted);
    };

    const handleAddToCart = async () => {
        try {
            for (let i = 0; i < quantity; i++) {
                await addToCart(product);
            }
            toast.success(`${product.title} added to cart`);
        } catch (error) {
            toast.error('Failed to add to cart');
        }
    };

    const handleBuyNow = () => {
        navigate('/checkout', {
            state: {
                buyNowProduct: {
                    ...product,
                    quantity: quantity
                }
            }
        });
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!newReview.comment.trim()) {
            toast.warning('Please enter a comment');
            return;
        }

        try {
            setSubmittingReview(true);
            const response = await productService.addProductReview(productId, newReview);
            if (response.success) {
                toast.success('Review submitted successfully');
                setReviews([response.review, ...reviews]);
                setNewReview({ rating: 5, comment: '' });

                const updatedProduct = { ...product };
                updatedProduct.rating.count += 1;

                updatedProduct.rating.rate = (product.rating.rate * product.rating.count + newReview.rating) / (product.rating.count + 1);
                setProduct(updatedProduct);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7);
    const formattedDeliveryDate = deliveryDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    if (loading) return <ProductDetailsSkeleton />;

    if (!product) {
        return (
            <div className="min-h-screen pt-20">
                <EmptyState
                    title="Product Not Found"
                    description="The product you're looking for might have been removed or is temporarily unavailable."
                    actionLabel="Back to Products"
                    onAction={() => navigate('/products')}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="container-custom py-8 md:py-12">
                { }
                <nav className="flex items-center gap-2 text-sm text-text-secondary mb-8">
                    <Link to="/home" className="hover:text-primary transition-colors">Home</Link>
                    <FaChevronRight size={10} />
                    <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
                    <FaChevronRight size={10} />
                    <span className="text-primary font-medium truncate max-w-[200px]">{product.title}</span>
                </nav>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-20">
                    { }
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative group"
                    >
                        <div className="bg-gray-50 rounded-[32px] overflow-hidden aspect-square flex items-center justify-center p-12 shadow-soft group-hover:shadow-soft-lg transition-all duration-500">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        <button
                            onClick={toggleWishlist}
                            className="absolute top-6 right-6 bg-white/90 backdrop-blur-md text-red-500 p-4 rounded-full shadow-soft hover:bg-white transition-all transform hover:scale-110 z-10"
                        >
                            {isWishlisted ? <FaHeart size={24} /> : <FaRegHeart size={24} />}
                        </button>
                    </motion.div>

                    { }
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col justify-center"
                    >
                        <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest rounded-full mb-6 w-fit">
                            {product.category}
                        </span>

                        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 tracking-tight leading-tight">
                            {product.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-8">
                            <StarRating rating={product.rating.rate} />
                            <span className="text-text-secondary font-medium">
                                ({product.rating.count} reviews)
                            </span>
                        </div>

                        <p className="text-3xl font-bold text-primary mb-8">
                            ₹{(product.price).toFixed(0)}
                        </p>

                        <p className="text-lg text-text-secondary leading-relaxed mb-10 italic">
                            {product.description}
                        </p>

                        { }
                        <div className="flex items-center gap-6 mb-10">
                            <span className="font-bold text-primary">Quantity</span>
                            <div className="flex items-center border-2 border-border rounded-full p-1 bg-gray-50/50">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="p-3 text-primary hover:bg-white hover:shadow-soft rounded-full transition-all"
                                >
                                    <FaMinus size={12} />
                                </button>
                                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="p-3 text-primary hover:bg-white hover:shadow-soft rounded-full transition-all"
                                >
                                    <FaPlus size={12} />
                                </button>
                            </div>
                        </div>

                        { }
                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <Button
                                onClick={handleAddToCart}
                                variant="secondary"
                                size="lg"
                                className="flex-1 py-5 rounded-apple text-lg"
                            >
                                <FaShoppingCart className="mr-3" />
                                Add to Cart
                            </Button>
                            <Button
                                onClick={handleBuyNow}
                                variant="primary"
                                size="lg"
                                className="flex-1 py-5 rounded-apple text-lg"
                            >
                                Buy Now
                            </Button>
                        </div>

                        { }
                        <div className="bg-slate-50 border border-slate-100 rounded-[24px] p-6 flex items-center gap-5">
                            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-soft">
                                <FaTruck size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-text-secondary font-medium mb-1">Estimated delivery by</p>
                                <p className="text-lg font-bold text-slate-900">{formattedDeliveryDate}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                { }
                <div className="border-t border-border pt-20 mb-20">
                    <div className="flex flex-col md:flex-row gap-16">
                        { }
                        <div className="md:w-2/3">
                            <h2 className="text-3xl font-bold text-primary mb-10">Customer Reviews</h2>

                            {reviews.length === 0 ? (
                                <div className="bg-gray-50 rounded-[24px] p-10 text-center">
                                    <p className="text-text-secondary italic">No reviews yet. Be the first to share your experience!</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {reviews.map((review) => (
                                        <div key={review._id} className="bg-gray-50/50 rounded-[24px] p-8 hover:bg-white hover:shadow-soft transition-all duration-300 border border-transparent hover:border-gray-100">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="font-bold text-lg text-primary">{review.username}</p>
                                                    <div className="mt-1">
                                                        <StarRating rating={review.rating} size={14} />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-text-secondary text-sm">
                                                    <FaRegClock size={12} />
                                                    {new Date(review.createdAt).toLocaleDateString('en-GB', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                            </div>
                                            <p className="text-text-secondary italic leading-relaxed">"{review.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        { }
                        <div className="md:w-1/3">
                            <div className="bg-slate-900 text-white rounded-[32px] p-8 sticky top-24">
                                <h3 className="text-2xl font-bold mb-6">Write a Review</h3>
                                <form onSubmit={handleReviewSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-3 opacity-80">Rating</label>
                                        <StarRating
                                            interactive
                                            rating={newReview.rating}
                                            onRatingChange={(r) => setNewReview({ ...newReview, rating: r })}
                                            size={24}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-3 opacity-80">Your Comment</label>
                                        <textarea
                                            value={newReview.comment}
                                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                            className="w-full bg-slate-800 border-none rounded-2xl p-4 text-white focus:ring-2 focus:ring-accent transition-all resize-none min-h-[120px]"
                                            placeholder="Tell us what you think..."
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        fullWidth
                                        disabled={submittingReview}
                                        className="bg-accent hover:bg-accent/90 text-primary font-bold py-4 rounded-2xl shadow-soft"
                                    >
                                        {submittingReview ? 'Submitting...' : 'Post Review'}
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                { }
                {relatedProducts.length > 0 && (
                    <div className="border-t border-border pt-20">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="text-3xl font-bold text-primary">You Might Also Like</h2>
                            <Link to="/products" className="text-accent font-bold flex items-center gap-2 hover:gap-3 transition-all">
                                View All Products <FaChevronRight size={12} />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((p) => (
                                <motion.div
                                    key={p._id}
                                    whileHover={{ y: -10 }}
                                    className="group cursor-pointer"
                                    onClick={() => navigate(`/product/${p._id}`)}
                                >
                                    <div className="bg-gray-50 rounded-[24px] p-8 mb-6 aspect-square flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:shadow-soft group-hover:bg-white">
                                        <img
                                            src={p.image}
                                            alt={p.title}
                                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    <h3 className="font-bold text-lg text-primary mb-2 line-clamp-1 group-hover:text-accent transition-colors">
                                        {p.title}
                                    </h3>
                                    <p className="font-bold text-xl text-primary">₹{(p.price).toFixed(0)}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetails;
