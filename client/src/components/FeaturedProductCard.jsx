import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const FeaturedProductCard = ({ product, index }) => {
    const navigate = useNavigate();

    const isImageLeft = index % 2 === 0;

    const imageVariants = {
        hidden: {
            opacity: 0,
            x: isImageLeft ? -80 : 80
        },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                delay: index * 0.2
            }
        }
    };

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                delay: index * 0.2 + 0.3
            }
        }
    };

    return (
        <div
            className={`flex flex-col ${isImageLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16 py-12 md:py-20 w-full cursor-pointer group`}
            onClick={() => navigate(`/product/${product._id}`)}
        >
            {}
            <motion.div
                variants={imageVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="w-full md:w-3/5"
            >
                <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-white shadow-soft group cursor-pointer">
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>
            </motion.div>

            {}
            <motion.div
                variants={textVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="w-full md:w-2/5 text-center md:text-left flex flex-col justify-center"
            >
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[#020617] tracking-tight">
                    {product.title}
                </h3>
                <p className="text-lg md:text-xl italic text-[#020617] leading-relaxed line-clamp-3">
                    {product.description || "A masterfully crafted piece designed for both elegance and everyday functionality. Seamlessly blending modern aesthetics with timeless comfort."}
                </p>
            </motion.div>
        </div>
    );
};

export default FeaturedProductCard;
