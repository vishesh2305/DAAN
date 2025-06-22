import React from 'react';

const ProgressBar = ({ current, target }) => {
  // Ensure we don't divide by zero and handle invalid numbers
  const currentAmount = parseFloat(current) || 0;
  const targetAmount = parseFloat(target) || 0;

  // Calculate the percentage, ensuring it doesn't exceed 100%
  let percentage = 0;
  if (targetAmount > 0) {
    percentage = Math.min((currentAmount / targetAmount) * 100, 100);
  }

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 my-2">
      <div
        className="bg-blue-600 h-2.5 rounded-full"
        style={{ width: `${percentage}%` }}
        aria-valuenow={percentage}
        aria-valuemin="0"
        aria-valuemax="100"
      ></div>
    </div>
  );
};

export default ProgressBar;