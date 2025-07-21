import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white font-nunito">
      <div className="text-center px-4">
        <h1 className="text-7xl font-extrabold text-indigo-600 mb-4">404</h1>
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          Sorry, the page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-full shadow hover:bg-indigo-700 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
