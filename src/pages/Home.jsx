import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import '../styles/Home.css';

const Home = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');

  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);

  const productsRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);
  const productRef = useRef(null);


  const scrollToSection = (section) => {
    const refs = {
      products: productsRef,
      about: aboutRef,
      contact: contactRef,
    };
    refs[section]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  useEffect(() => {
  if (searchQuery && productRef.current) {
    productRef.current.scrollIntoView({ behavior: 'smooth' });
  }
}, [searchQuery]);


  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    const matchesPrice =
      priceFilter === '0-500'
        ? product.price <= 500
        : priceFilter === '500-1000'
        ? product.price > 500 && product.price <= 1000
        : priceFilter === '1000+'
        ? product.price > 1000
        : true;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        scrollToSection={scrollToSection}
      />

      <section className="hero">
        <div className="hero-content">
          <h1>Shop the Latest Trends</h1>
          <p>Discover amazing products at unbeatable prices</p>
        </div>
      </section>

      <section className="section" ref={productsRef}>
        <h2>Best Sellers</h2>
        <div className="products">
          {products.slice(0, 5).map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>

        <section className="hero-1">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Discover your Choice</h1>
              <p>Shop now</p>
            </div>
          </div>
        </section>


        <div className="product-filters" ref={productRef}>
          <div className="category-boxes">
            <div
              className={`category-box ${categoryFilter === "men's clothing" ? 'active' : ''}`}
              onClick={() => setCategoryFilter("men's clothing")}
            >
              <img className="cat-img" src="https://i.pinimg.com/736x/cb/16/9a/cb169a444973897e466310e41dce00f1.jpg" alt="Men" />
              <p>Men</p>
            </div>
            <div
              className={`category-box ${categoryFilter === "women's clothing" ? 'active' : ''}`}
              onClick={() => setCategoryFilter("women's clothing")}
            >
              <img className="cat-img" src="https://i.pinimg.com/736x/cd/84/28/cd842888a99c11897efeee21cbafeaf2.jpg" alt="Women" />
              <p>Women</p>
            </div>
            <div
              className={`category-box ${categoryFilter === "jewelery" ? 'active' : ''}`}
              onClick={() => setCategoryFilter("jewelery")}
            >
              <img className="cat-img" src="https://i.pinimg.com/736x/26/f3/df/26f3dfe0aaacb597b50bce450e21081b.jpg" alt="Jewellery" />
              <p>Jewellery</p>
            </div>
            <div
              className={`category-box ${categoryFilter === "electronics" ? 'active' : ''}`}
              onClick={() => setCategoryFilter("electronics")}
            >
              <img className="cat-img" src="https://i.pinimg.com/736x/3a/34/72/3a3472539dc711f2d919c5c6c0c37ce1.jpg" alt="Electronics" />
              <p>Electronics</p>
            </div>
          </div>
        </div>

        {(categoryFilter || searchQuery) && (
          <div className="products">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} addToCart={addToCart} />
              ))
            ) : (
              <p style={{ marginTop: '2rem', textAlign: 'center' }}>No products found.</p>
            )}
          </div>
        )}
      </section>

      <section className="section" ref={aboutRef}>
        <h2 className="testimonial-heading">What Our Customers Say</h2>
        <div className="testimonial-cards">
         <div className="testimonial-card">
            <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Sarah" />
            <h3>Sarah Johnson</h3>
            <p className="role">Verified Customer</p>
            <p className="quote">
              "I've been shopping here for years. The quality of products and customer service is unmatched. My recent order arrived earlier than expected!"
            </p>
            <div className="stars">★★★★★</div>
          </div>
          <div className="testimonial-card">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Michael" />
            <h3>Michael Chen</h3>
            <p className="role">Verified Customer</p>
            <p className="quote">
              "The checkout process was seamless, and the products exceeded my expectations. Will definitely be a returning customer!"
            </p>
            <div className="stars">★★★★★</div>
          </div>
          <div className="testimonial-card">
            <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Emily" />
            <h3>Emily Rodriguez</h3>
            <p className="role">Verified Customer</p>
            <p className="quote">
              "I love the variety of products available here. Found exactly what I was looking for and at a competitive price. Highly recommend!"
            </p>
            <div className="stars">★★★★★</div>
          </div>
        </div>
      </section>

      <section className="section" ref={contactRef}>
        <div className="contact-section">
          <h1>Contact Us</h1>
          <div className="contact-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>Name:</label>
              <input type="text" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} required />

              <label>Email:</label>
              <input type="email" name="email" placeholder="Your email" value={formData.email} onChange={handleChange} required />

              <label>Message:</label>
              <textarea name="message" placeholder="Your message" rows="5" value={formData.message} onChange={handleChange} required></textarea>

              <button type="submit">Send</button>

              {formSubmitted && (
                <p style={{ color: 'green', marginTop: '1rem', fontWeight: 'bold' }}>
                  ✅ Your message has been sent successfully!
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;