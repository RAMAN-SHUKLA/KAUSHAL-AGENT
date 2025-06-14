import React from 'react';

const GlowCard = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-accent-yellow/20 transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
};

export default GlowCard; 