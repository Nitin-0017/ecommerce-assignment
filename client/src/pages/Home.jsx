import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaArrowRight, FaStar, FaShieldAlt, FaTruck, FaUndo, FaTshirt, FaGem, FaMobile } from 'react-icons/fa';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import FeaturedProductCard from '../components/FeaturedProductCard';
import { motion } from 'framer-motion';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typewriterText, setTypewriterText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const phrases = [
    'Shop smarter',
    'Discover quality products',
    'Seamless shopping experience'
  ];

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseDuration = 2000;

    const typewriterTimer = setTimeout(() => {
      if (!isDeleting && typewriterText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
      } else if (isDeleting && typewriterText === '') {
        setIsDeleting(false);
        setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      } else {
        setTypewriterText(
          isDeleting
            ? currentPhrase.substring(0, typewriterText.length - 1)
            : currentPhrase.substring(0, typewriterText.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(typewriterTimer);
  }, [typewriterText, isDeleting, currentPhraseIndex]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({ limit: 8 });
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
      toast.success(`${product.title} added to cart`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const categories = [
    {
      name: "Men's Fashion",
      category: "men's clothing",
      image: '/images/mens-fashion-v2.jpg',
      gradient: 'from-blue-500 to-indigo-600',
      icon: FaTshirt
    },
    {
      name: "Women's Fashion",
      category: "women's clothing",
      image: '/images/womens-fashion-v2.jpg',
      gradient: 'from-pink-500 to-rose-600',
      icon: FaTshirt
    },
    {
      name: 'Jewelry',
      category: 'jewelery',
      image: '/images/accessories-v2.jpg',
      gradient: 'from-yellow-500 to-amber-600',
      icon: FaGem
    },
    {
      name: 'Electronics',
      category: 'electronics',
      image: '/images/electronics-v2.jpg',
      gradient: 'from-purple-500 to-violet-600',
      icon: FaMobile
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="relative h-[600px] overflow-hidden bg-slate-900">
        <div className="absolute inset-0 opacity-50">
          <div className="hero-bg-slide hero-bg-1"></div>
          <div className="hero-bg-slide hero-bg-2"></div>
          <div className="hero-bg-slide hero-bg-3"></div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/60"></div>

        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="container-custom text-center text-white">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight">
              Welcome to <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">SwiftKart</span>
            </h1>
            <div className="h-16 flex items-center justify-center mb-8">
              <p className="text-2xl md:text-3xl font-light text-gray-200">
                {typewriterText}
                <span className="typewriter-cursor">|</span>
              </p>
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => navigate('/products')}
                variant="accent"
                size="lg"
                className="group bg-sky-500 hover:bg-sky-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-sky-500/50"
              >
                Explore Products
                <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 tracking-tight"
            >
              Curated Picks
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 text-lg max-w-2xl mx-auto"
            >
              Hand-selected essentials for your modern lifestyle.
            </motion.p>
          </div>

          {loading ? (
            <div className="space-y-24">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-12 animate-pulse">
                  <div className="w-full md:w-3/5 h-[400px] bg-white rounded-xl shadow-soft"></div>
                  <div className="w-full md:w-2/5 space-y-4 py-12">
                    <div className="h-8 bg-white/50 rounded w-3/4"></div>
                    <div className="h-20 bg-white/50 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-24 md:space-y-32">
              {products.slice(0, 4).map((product, index) => (
                <FeaturedProductCard
                  key={product._id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 tracking-tight"
            >
              Explore Collections
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-slate-500 text-lg"
            >
              Find exactly what you're looking for.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((categoryItem, index) => (
              <motion.div
                key={categoryItem.category}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => navigate(`/products?category=${categoryItem.category}`)}
                className="group cursor-pointer relative h-[350px] overflow-hidden rounded-[12px] shadow-soft hover:shadow-soft-lg transition-all duration-300"
              >
                <img
                  src={categoryItem.image}
                  alt={categoryItem.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${categoryItem.gradient} opacity-40 group-hover:opacity-50 transition-opacity`}></div>

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                  <categoryItem.icon className="text-5xl mb-4 drop-shadow-xl transform group-hover:-translate-y-1 transition-transform" />
                  <h3 className="text-2xl font-bold text-center drop-shadow-lg">
                    {categoryItem.name}
                  </h3>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-sm font-medium bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                      View Collection
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
