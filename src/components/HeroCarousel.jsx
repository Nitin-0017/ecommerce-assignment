import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HeroCarousel.css';

const slides = [
  {
    tagline: "Season Sale",
    title: "MEN'S FASHION",
    subtitle: "Min. 35–70% Off",
    image: "/images/mens-fashion.jpg"
  },
  {
    tagline: "New Arrival",
    title: "WOMEN'S FASHION",
    subtitle: "Flat 50% Off",
    image: "/images/womens-fashion.jpg"
  },
  {
    tagline: "Trending Now",
    title: "ACCESSORIES",
    subtitle: "Upto 40% Off",
    image: "/images/jewellery.jpg"
  },
  {
    tagline: "Limited Offer",
    title: "SHIRTS COLLECTION",
    subtitle: "Extra 50% Off",
    image: "/images/shirt_collection.jpg"
  }
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;
  const navigate = useNavigate(); 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % length);
    }, 4000);
    return () => clearInterval(interval);
  }, [length]);

  return (
    <div className="hero-carousel">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`carousel-slide ${index === current ? "active" : ""}`}
        >
          <div className="carousel-overlay"></div>
          <div className="carousel-content">
           
            <div className="carousel-text">
              <h3 className="tagline">{slide.tagline}</h3>
              <h1 className="headline">{slide.title}</h1>
              <p className="subtext">{slide.subtitle}</p>
              <div className="buttons">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/products')} 
                >
                  Shop Now
                </button>
              </div>
            </div>

           
            <div className="carousel-image">
              <img src={slide.image} alt={slide.title} />
            </div>
          </div>
        </div>
      ))}

      <div className="carousel-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={index === current ? 'active' : ''}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
