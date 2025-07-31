import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin border-t-transparent"></div>
    </div>
  );
};

export default Loader;
