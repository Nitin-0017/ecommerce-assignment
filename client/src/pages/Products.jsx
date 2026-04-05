import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import { FaShoppingCart, FaFilter, FaTimes, FaStar, FaTshirt, FaGem, FaMobile, FaHeart, FaRegHeart } from 'react-icons/fa';
import { ProductCardSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';

const Products = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    search: searchParams.get('search') || '',
    sort: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const { addToCart } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedWishlistData = localStorage.getItem('wishlist');
    if (savedWishlistData) {
      setWishlist(JSON.parse(savedWishlistData));
    }
  }, []);

  const toggleWishlist = (product) => {
    const isWishlisted = wishlist.some(item => item._id === product._id);
    let updatedWishlist;

    if (isWishlisted) {
      updatedWishlist = wishlist.filter(item => item._id !== product._id);
      toast.info(`${product.title} removed from wishlist`);
    } else {
      updatedWishlist = [...wishlist, product];
      toast.success(`${product.title} added to wishlist`);
    }

    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const categories = [
    { value: "men's clothing", label: "Men's Fashion", icon: FaTshirt, color: 'text-slate-600' },
    { value: "women's clothing", label: "Women's Fashion", icon: FaTshirt, color: 'text-pink-600' },
    { value: 'jewelery', label: 'Jewelry', icon: FaGem, color: 'text-yellow-600' },
    { value: 'electronics', label: 'Electronics', icon: FaMobile, color: 'text-purple-600' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 500);

    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    if (category || search) {
      setFilters(previousFilters => ({
        ...previousFilters,
        category: category || '',
        search: search || ''
      }));
    }
  }, [searchParams]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const filterParams = {};
      if (filters.category) filterParams.category = filters.category;
      if (filters.minPrice) filterParams.minPrice = parseFloat(filters.minPrice) / 83;
      if (filters.maxPrice) filterParams.maxPrice = parseFloat(filters.maxPrice) / 83;
      if (filters.minRating) filterParams.minRating = filters.minRating;
      if (filters.search) filterParams.search = filters.search;
      if (filters.sort) filterParams.sort = filters.sort;

      const response = await productService.getProducts(filterParams);
      setProducts(response.products || []);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      minRating: '',
      search: '',
      sort: ''
    });
  };

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
      toast.success(`${product.title} added to cart`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleBuyNow = (product) => {
    navigate('/checkout', {
      state: {
        buyNowProduct: {
          ...product,
          quantity: 1
        }
      }
    });
  };

  const activeFiltersCount = [filters.category, filters.minPrice, filters.maxPrice, filters.minRating, filters.sort].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-white">
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {filters.category ? categories.find(c => c.value === filters.category)?.label : 'All Products'}
            </h1>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden btn-primary flex items-center gap-2 relative"
          >
            <FaFilter />
            Filters
            {activeFiltersCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <aside className={`md:w-72 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="card sticky top-20 bg-gradient-to-br from-white to-gray-50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <FaFilter className="text-slate-900" />
                  Filters
                </h2>
                {activeFiltersCount > 0 && (
                  <span className="bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-3 text-primary">Category</label>
                <div className="space-y-2">
                  {categories.map((categoryItem) => (
                    <label key={categoryItem.value} className={`flex items-center cursor-pointer p-3 rounded-apple-sm transition-all ${filters.category === categoryItem.value ? 'bg-slate-100 border-2 border-slate-900' : 'hover:bg-gray-50'
                      }`}>
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === categoryItem.value}
                        onChange={() => handleFilterChange('category', categoryItem.value)}
                        className="mr-3 accent-slate-900 w-4 h-4"
                      />
                      <span className="text-sm font-medium">{categoryItem.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-3 text-primary">Price Range (₹)</label>
                <div className="px-2">
                  <div className="flex justify-between text-sm text-text-secondary mb-3">
                    <span className="font-semibold">₹{filters.minPrice || 0}</span>
                    <span className="font-semibold">₹{filters.maxPrice || 10000}</span>
                  </div>

                  <div className="relative mb-4">
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={filters.minPrice || 0}
                      onChange={(e) => {
                        const newMin = parseInt(e.target.value);
                        const currentMax = parseInt(filters.maxPrice) || 10000;
                        if (newMin <= currentMax) {
                          handleFilterChange('minPrice', newMin.toString());
                        }
                      }}
                      className="w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer relative z-10"
                    />
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      step="100"
                      value={filters.maxPrice || 10000}
                      onChange={(e) => {
                        const newMax = parseInt(e.target.value);
                        const currentMin = parseInt(filters.minPrice) || 0;
                        if (newMax >= currentMin) {
                          handleFilterChange('maxPrice', newMax.toString());
                        }
                      }}
                      className="w-full h-2 bg-transparent rounded-lg appearance-none cursor-pointer absolute top-0 left-0"
                    />
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-2 bg-gray-200 rounded-lg pointer-events-none">
                      <div
                        className="absolute h-full bg-slate-900 rounded-lg"
                        style={{
                          left: `${((filters.minPrice || 0) / 10000) * 100}%`,
                          right: `${100 - ((filters.maxPrice || 10000) / 10000) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-text-secondary">
                    <span>₹0</span>
                    <span>₹10,000</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-3 text-primary">Minimum Rating</label>
                <div className="space-y-2">
                  {[4, 3, 2].map((rating) => (
                    <label key={rating} className={`flex items-center cursor-pointer p-3 rounded-apple-sm transition-all ${filters.minRating === rating.toString() ? 'bg-slate-100 border-2 border-slate-900' : 'hover:bg-gray-50'
                      }`}>
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.minRating === rating.toString()}
                        onChange={() => handleFilterChange('minRating', rating.toString())}
                        className="mr-3 accent-slate-900 w-4 h-4"
                      />
                      <span className="text-sm flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} size={14} className={i < rating ? 'text-yellow-500' : 'text-gray-300'} />
                        ))}
                        <span className="ml-1">& up</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold mb-3 text-primary">Sort By</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="input-field text-sm py-3 w-full"
                >
                  <option value="">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Top Rated</option>
                </select>
              </div>

              <Button onClick={resetFilters} variant="secondary" fullWidth size="sm">
                <FaTimes className="mr-2" />
                Clear Filters
              </Button>
            </div>
          </aside>

          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center">
                <EmptyState
                  title={filters.search ? `No results for "${filters.search}"` : "No products found"}
                  description={filters.search
                    ? "We couldn't find any products matching your search. Try checking for typos or using broader terms."
                    : "Try adjusting your filters or search query to find what you're looking for"}
                  actionLabel="Explore All Products"
                  onAction={resetFilters}
                />
                {filters.search && (
                  <div className="mt-8">
                    <p className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Try searching for:</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {['Men', 'Jewelry', 'Electronics', 'Women'].map(term => (
                        <button
                          key={term}
                          onClick={() => handleFilterChange('search', term)}
                          className="px-4 py-2 rounded-full border border-gray-200 hover:border-accent hover:text-accent transition-all text-sm font-medium bg-white shadow-sm"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage).map((product) => (
                    <div
                      key={product._id}
                      className="card group hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                      onClick={() => navigate(`/product/${product._id}`)}
                    >
                      <div className="relative overflow-hidden bg-gray-50" style={{ aspectRatio: '1/1' }}>
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                        />
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(product); }}
                          className="absolute top-3 left-3 bg-white/80 hover:bg-white text-red-500 rounded-full p-2 shadow-soft transition-all transform hover:scale-110 z-10"
                        >
                          {wishlist.some(item => item._id === product._id) ? (
                            <FaHeart className="text-red-500" />
                          ) : (
                            <FaHeart className="text-gray-300 hover:text-red-400" />
                          )}
                        </button>
                        <div className="absolute top-3 right-3">
                          <div className="bg-white rounded-full px-3 py-1 shadow-soft flex items-center gap-1">
                            <FaStar className="text-yellow-500" size={12} />
                            <span className="text-sm font-bold">{product.rating?.rate || 0}</span>
                          </div>
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-accent transition-colors">
                        {product.title}
                      </h3>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-3xl font-bold text-[#020617]">
                          ₹{(product.price * 83).toFixed(0)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                          variant="secondary"
                          fullWidth
                          size="sm"
                          className="group/button"
                        >
                          <FaShoppingCart className="mr-2 group-hover/button:scale-110 transition-transform" />
                          Add to Cart
                        </Button>
                        <Button
                          onClick={(e) => { e.stopPropagation(); handleBuyNow(product); }}
                          variant="primary"
                          fullWidth
                          size="sm"
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {products.length > productsPerPage && (
                  <div className="mt-8 flex justify-center items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-apple-sm bg-white border-2 border-border hover:border-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                    >
                      Previous
                    </button>

                    <div className="flex gap-1">
                      {[...Array(Math.ceil(products.length / productsPerPage))].map((_, index) => (
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
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(products.length / productsPerPage)))}
                      disabled={currentPage === Math.ceil(products.length / productsPerPage)}
                      className="px-4 py-2 rounded-apple-sm bg-white border-2 border-border hover:border-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;