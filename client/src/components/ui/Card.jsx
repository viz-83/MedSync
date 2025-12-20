import React from 'react';

const Card = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-white rounded-2xl shadow-soft border border-gray-100/50 overflow-hidden ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
