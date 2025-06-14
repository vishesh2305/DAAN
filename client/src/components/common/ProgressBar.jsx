import React from 'react';

const ProgressBar = ({ raised, goal }) => {
    const percentage = Math.min((raised / goal) * 100, 100);
    return (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
