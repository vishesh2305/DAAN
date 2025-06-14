import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white dark:bg-gray-800/50 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700/50 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
