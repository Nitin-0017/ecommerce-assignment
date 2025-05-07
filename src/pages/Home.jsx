import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import "../styles/Home.css";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <section className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Shop the Latest Trends</h1>
            <p>Discover amazing products at unbeatable prices</p>
          </div>
          <img
            className="hero-image"
            src="https://i.pinimg.com/736x/69/4e/95/694e952517fe9139e14a7a65d4cfaa4b.jpg"
            alt="Trendy fashion"
          />
        </div>
      </section>

      <section className="section" id="products">
        <h2>Featured Products</h2>
        <div className="products">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p style={{ marginTop: "2rem", textAlign: "center" }}>
              No products found.
            </p>
          )}
        </div>
      </section>

      <section className="section" id="testimonials">
        <h2 className="testimonial-heading">What Our Customers Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <img
              src="https://randomuser.me/api/portraits/women/68.jpg"
              alt="Sarah"
            />
            <h3>Sarah Johnson</h3>
            <p className="role">Verified Customer</p>
            <p className="quote">
              "I've been shopping here for years. The quality of products and
              customer service is unmatched. My recent order arrived earlier
              than expected!"
            </p>
            <div className="stars">★★★★★</div>
          </div>

          <div className="testimonial-card">
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Michael"
            />
            <h3>Michael Chen</h3>
            <p className="role">Verified Customer</p>
            <p className="quote">
              "The checkout process was seamless, and the products exceeded my
              expectations. Will definitely be a returning customer!"
            </p>
            <div className="stars">★★★★★</div>
          </div>

          <div className="testimonial-card">
            <img
              src="https://randomuser.me/api/portraits/women/65.jpg"
              alt="Emily"
            />
            <h3>Emily Rodriguez</h3>
            <p className="role">Verified Customer</p>
            <p className="quote">
              "I love the variety of products available here. Found exactly what
              I was looking for and at a competitive price. Highly recommend!"
            </p>
            <div className="stars">★★★★★</div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
