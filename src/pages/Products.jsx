import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../styles/Products.css';

const Products = ({ addToCart, searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);

 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('https://fakestoreapi.com/products');
        const data = await res.json();
        setProducts(data);
        setLoading(false);

        const prices = data.map((p) => p.price * 83);
        const min = Math.floor(Math.min(...prices));
        const max = Math.ceil(Math.max(...prices));
        setMinPrice(min);
        setMaxPrice(max);
        setPriceRange([min, max]);
      } catch (error) {
        setError('Failed to fetch products');
        console.log(error)
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const allCategories = [...new Set(products.map((p) => p.category))];

 
  useEffect(() => {
    let temp = [...products];

    if (searchQuery.trim()) {
      temp = temp.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      temp = temp.filter((p) => selectedCategories.includes(p.category));
    }

    temp = temp.filter((p) => {
      const price = p.price * 83;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (minRating > 0) {
      temp = temp.filter((p) => (p.rating?.rate || 0) >= minRating);
    }

    if (sortBy === 'price-asc') {
      temp.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      temp.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating-desc') {
      temp.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
    }

    setFiltered(temp);
  }, [products, searchQuery, selectedCategories, priceRange, minRating, sortBy]);

  
  const resetFilters = () => {
    setSelectedCategories([]);
    setSortBy('');
    setMinRating(0);
    setPriceRange([minPrice, maxPrice]);
  };

  
  const handleCategoryToggle = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="products-container">
      <aside className="sidebar modern">
        <h2>Filters</h2>

      
        <div className="filter-group">
          <label>Categories</label>
          <div className="checkbox-group">
            {allCategories.map((cat) => (
              <label key={cat}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCategoryToggle(cat)}
                />
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </label>
            ))}
          </div>
        </div>

    
        <div className="filter-group">
          <label>Price Range</label>
          <div className="slider-wrapper">
            <Slider
              range
              min={minPrice}
              max={maxPrice}
              step={100}
              value={priceRange}
              onChange={setPriceRange}
              trackStyle={[{ backgroundColor: '#003366' }]}
              handleStyle={[
                { borderColor: '#003366' },
                { borderColor: '#003366' },
              ]}
            />
            <div className="price-values">
              <span>₹{priceRange[0]}</span>
              <span>₹{priceRange[1]}</span>
            </div>
          </div>
        </div>

   
        <div className="filter-group">
          <label>Minimum Rating</label>
          <div className="rating-options">
            {[5, 4, 3, 2, 1].map((star) => (
              <label key={star}>
                <input
                  type="radio"
                  name="rating"
                  value={star}
                  checked={minRating === star}
                  onChange={() => setMinRating(star)}
                />
                {'★'.repeat(star)} & Up
              </label>
            ))}
          </div>
        </div>

    
        <div className="filter-group">
          <label>Sort By</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">None</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-desc">Rating: High to Low</option>
          </select>
        </div>

        <button className="clear-btn" onClick={resetFilters}>
          Clear All Filters
        </button>
      </aside>

      <main className="products-main">
        <h1>All Products</h1>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <div className="product-grid">
          {!loading && filtered.length > 0 ? (
            filtered.map((p) => (
              <ProductCard key={p.id} product={p} addToCart={addToCart} />
            ))
          ) : (
            !loading && <p>No matching products found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Products;