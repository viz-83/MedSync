import React from 'react';

const Card = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-surface rounded-2xl shadow-soft border border-gray-100/50 dark:border-gray-700/50 overflow-hidden hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200 ease-out ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
