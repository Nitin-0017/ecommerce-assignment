import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => setProducts(data.slice(0, 8)));
  }, []);

  return (
    <>
      <Navbar />

      <section className="hero">
        <h1>Shop the Latest Trends</h1>
        <p>Discover amazing products at unbeatable prices</p>
      </section>

      <section className="section" id="products">
        <h2>Featured Products</h2>
        <div className="products">
          {products.map(product => (
            <div className="product" key={product.id}>
              <img src={product.image} alt={product.title} />
              <h3>{product.title}</h3>
              <p>${product.price}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="testimonials">
        <h2>What Our Customers Say</h2>
        <div className="testimonials">
          <div className="testimonial">"Absolutely love the quality and fast shipping!" - Sarah</div>
          <div className="testimonial">"This is my favorite online store now." - Mike</div>
          <div className="testimonial">"A+ service and amazing prices." - Lisa</div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;