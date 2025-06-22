import React from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle className="h-5 w-5" />,
  error: <XCircle className="h-5 w-5" />,
  info: <Info className="h-5 w-5" />,
};

const colors = {
  success: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-400',
  error: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-400',
  info: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-400',
};

const Notification = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  return (
    <div 
      className={`p-4 mb-6 border rounded-lg flex items-center justify-between animate-fade-in ${colors[type]}`}
      role="alert"
    >
      <div className="flex items-center">
        <span className="mr-3">{icons[type]}</span>
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10">
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Notification;