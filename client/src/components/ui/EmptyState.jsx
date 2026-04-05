import React from 'react';
import Lottie from 'lottie-react';
import Button from './Button';

const EmptyState = ({
    animationData,
    title = 'No items found',
    description,
    actionLabel,
    onAction,
    className = ''
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
            {animationData && (
                <div className="w-64 h-64 mb-6">
                    <Lottie animationData={animationData} loop={true} />
                </div>
            )}
            <h3 className="text-2xl font-bold text-text-primary mb-3 text-center">
                {title}
            </h3>
            {description && (
                <p className="text-text-secondary text-center mb-8 max-w-md text-lg">
                    {description}
                </p>
            )}
            {actionLabel && onAction && (
                <Button onClick={onAction} variant="primary" size="lg">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;
