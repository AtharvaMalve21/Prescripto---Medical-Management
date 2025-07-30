import React, { useContext, useState } from "react";
import { assets } from "../assets/assets_frontend/assets.js";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import Loader from "../components/Loader.jsx";
import axios from "axios";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser, loading, setIsLoggedIn } = useContext(UserContext);
  const [showMenu, setShowMenu] = useState(false);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const logoutAccount = async () => {
    try {
      const { data } = await axios.get(URI + "/api/auth/logout-patient", {
        withCredentials: true,
      });
      if (data.success) {
        setUser(null);
        setIsLoggedIn(false);
        toast.success(data.message);
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="flex items-center justify-between py-4 mb-5 border-b border-gray-300 text-base font-nunito relative px-5">
      {loading && <Loader />}

      {/* Logo */}
      <div className="flex items-center gap-3 text-primary">
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt="Logo"
          className="w-40 cursor-pointer"
        />
        {!user && (
          <Link
            to={import.meta.env.VITE_ADMIN_URI}
            className=" mt-2 hidden sm:inline-block text-xs px-3 py-1 bg-primary/10 text-primary border border-primary rounded-full shadow-sm cursor-pointer"
          >
            Admin Panel
          </Link>
        )}
      </div>

      {/* Desktop Nav Links */}
      <ul className="hidden md:flex items-center gap-6 font-semibold text-gray-700">
        {["/", "/doctors", "/about", "/contact"].map((path, index) => {
          const labels = ["HOME", "ALL DOCTORS", "ABOUT", "CONTACT"];
          return (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                isActive
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "hover:text-primary transition-colors duration-200"
              }
            >
              {labels[index]}
            </NavLink>
          );
        })}
      </ul>

      {/* Right Side Buttons */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Icon */}

        {/* User Avatar */}
        {user ? (
          <div className="relative group">
            <div className="cursor-pointer">
              {user?.additionalDetails?.image ? (
                <img
                  src={user.additionalDetails.image}
                  alt="profile-img"
                  className="w-10 h-10 rounded-full object-cover border-2 border-primary hover:scale-105 hover:shadow-md transition-all duration-300"
                />
              ) : (
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold text-lg uppercase hover:scale-105 hover:shadow-md transition-all duration-300">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200">
              <Link
                to="/my-profile"
                className="block px-5 py-3 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                My Profile
              </Link>
              <hr className="border-t border-gray-200" />
              <Link
                to="/my-appointments"
                className="block px-5 py-3 text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors"
              >
                My Appointments
              </Link>
              <hr className="border-t border-gray-200" />
              <button
                onClick={logoutAccount}
                className="w-full text-left px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/register")}
            className="bg-primary text-white px-5 py-2 rounded-full font-semibold hover:bg-primary/90 transition-all duration-200"
          >
            Create Account
          </button>
        )}
        <img
          onClick={() => setShowMenu(!showMenu)}
          src={assets.menu_icon}
          className="w-6 md:hidden cursor-pointer"
          alt="menu_icon"
        />
      </div>

      {/* Mobile Nav Only (No Logo, No Avatar) */}
      <div
        className={`md:hidden fixed top-16 right-0 w-64 bg-white border-l shadow-3xl transition-transform duration-300 ease-in-out z-30 ${
          showMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <ul className="flex flex-col px-6 py-5 text-sm font-medium">
          {["/", "/doctors", "/about", "/contact"].map((path, index) => {
            const labels = ["HOME", "ALL DOCTORS", "ABOUT", "CONTACT"];
            return (
              <li key={path} className="group">
                <NavLink
                  to={path}
                  onClick={() => setShowMenu(false)}
                  className="block py-2 hover:text-primary transition-colors"
                >
                  {labels[index]}
                </NavLink>
                <hr className="border-t border-gray-200 group-hover:border-primary transition-colors" />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
