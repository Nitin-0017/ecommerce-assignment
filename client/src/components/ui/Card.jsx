import React from 'react';

const Card = ({ children, className = '', hover = true, padding = true }) => {
    const hoverClass = hover ? 'hover:shadow-soft-hover' : '';
    const paddingClass = padding ? 'p-6' : '';

    return (
        <div className={`card ${hoverClass} ${paddingClass} ${className}`.trim().replace(/\s+/g, ' ')}>
            {children}
        </div>
    );
};

export default Card;
