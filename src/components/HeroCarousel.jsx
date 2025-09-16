import React, { useState, useEffect } from 'react';
import '../styles/HeroCarousel.css';

const HeroCarousel = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % length);
    }, 4000); // change slide every 4 seconds

    return () => clearInterval(interval);
  }, [length]);

  if (!Array.isArray(slides) || slides.length === 0) return null;

  return (
    <div className="carousel">
      {slides.map((slide, index) => (
        <div
          className={index === current ? 'slide active' : 'slide'}
          key={index}
        >
          {index === current && (
            <img src={slide.image} alt={slide.title} className="carousel-image" />
          )}
        </div>
      ))}

      <div className="dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={index === current ? 'dot active' : 'dot'}
            onClick={() => setCurrent(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
