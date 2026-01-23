import React from 'react';
function AuthButton({ children, type = "button", disabled, className = "", ...props }) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300
        ${disabled 
          ? 'bg-gray-600 cursor-not-allowed' 
          : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98]'}
        text-white shadow-lg ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default AuthButton;