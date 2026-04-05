import React, { useState } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating = ({ rating = 0, maxStars = 5, onRatingChange, interactive = false, size = 20 }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const renderStars = () => {
        const stars = [];
        const currentRating = interactive && hoverRating > 0 ? hoverRating : rating;

        for (let i = 1; i <= maxStars; i++) {
            const isFull = i <= Math.floor(currentRating);
            const isHalf = !isFull && i <= Math.ceil(currentRating) && currentRating % 1 >= 0.5;

            stars.push(
                <span
                    key={i}
                    className={`${interactive ? 'cursor-pointer transform hover:scale-110' : ''} transition-all`}
                    onClick={() => interactive && onRatingChange && onRatingChange(i)}
                    onMouseEnter={() => interactive && setHoverRating(i)}
                    onMouseLeave={() => interactive && setHoverRating(0)}
                    style={{ fontSize: size }}
                >
                    {isFull ? (
                        <FaStar className="text-yellow-400" />
                    ) : isHalf ? (
                        <FaStarHalfAlt className="text-yellow-400" />
                    ) : (
                        <FaRegStar className="text-gray-300" />
                    )}
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="flex items-center gap-1">
            {renderStars()}
        </div>
    );
};

export default StarRating;
