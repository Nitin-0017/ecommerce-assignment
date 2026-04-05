import React from 'react';

const Skeleton = ({ variant = 'text', width, height, className = '', count = 1 }) => {
    const baseClasses = 'animate-pulse bg-gray-200 rounded';

    const variantClasses = {
        text: 'h-4',
        title: 'h-6',
        card: 'h-48',
        image: 'h-64',
        circle: 'rounded-full'
    };

    const skeletonClass = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();
    const style = {};

    if (width) style.width = width;
    if (height) style.height = height;

    const skeletons = Array.from({ length: count }, (_, index) => (
        <div key={index} className={skeletonClass} style={style} />
    ));

    return count > 1 ? <div className="space-y-3">{skeletons}</div> : skeletons[0];
};

export const ProductCardSkeleton = () => {
    return (
        <div className="card p-4">
            <Skeleton variant="image" className="mb-4" />
            <Skeleton variant="title" className="mb-2" width="80%" />
            <Skeleton variant="text" className="mb-2" width="60%" />
            <Skeleton variant="text" width="40%" />
        </div>
    );
};

export default Skeleton;
