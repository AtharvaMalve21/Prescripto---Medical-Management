import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-t-transparent border-blue-500 rounded-full animate-spin shadow-md"></div>
        <div className="absolute inset-1 border-4 border-t-transparent border-blue-300 rounded-full animate-spin [animation-duration:2s] opacity-70"></div>
      </div>
    </div>
  );
};

export default Loader;
