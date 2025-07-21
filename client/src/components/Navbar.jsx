import React, { useContext, useState } from "react";
import { assets } from "../assets/assets_frontend/assets.js";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import axios from "axios";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser, setIsLoggedIn } = useContext(UserContext);
  const [dropDownMenu, setDropDownMenu] = useState(false);

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
        setDropDownMenu(false);
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  const toggleDropDownMenu = () => setDropDownMenu((prev) => !prev);

  return (
    <div className="flex items-center justify-between py-4 mb-5 border-b border-gray-300 text-base font-nunito relative">
      {/* Logo */}
      <img src={assets.logo} alt="Logo" className="w-40 cursor-pointer" />

      {/* Navigation Links */}
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

      {/* User Icon or Create Account */}
      {user ? (
        <div className="relative">
          <button onClick={toggleDropDownMenu} className="focus:outline-none">
            {user?.additionalDetails?.image ? (
              <img
                src={user.additionalDetails.image}
                alt="profile-img"
                className="w-10 h-10 rounded-full object-cover border-2 border-primary hover:scale-105 hover:shadow-md transition-all duration-300 cursor-pointer"
              />
            ) : (
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold text-lg uppercase hover:scale-105 hover:shadow-md transition-all duration-300 cursor-pointer">
                {user.name.charAt(0)}
              </div>
            )}
          </button>

          {dropDownMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10">
              <Link
                to="/my-profile"
                className="block px-5 py-3 text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                onClick={() => setDropDownMenu(false)}
              >
                My Profile
              </Link>
              {/* Divider */}
              <hr className="border-t border-gray-200" />
              <Link
                to="/my-appointments"
                className="block px-5 py-3 text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors"
                onClick={() => setDropDownMenu(false)}
              >
                My Appointments
              </Link>

              {/* Divider */}
              <hr className="border-t border-gray-200" />

              <button
                onClick={logoutAccount}
                className="w-full text-left px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <button
            onClick={() => navigate("/register")}
            className="bg-primary text-white px-5 py-2 rounded-full font-semibold hover:bg-primary/90 transition-all duration-200"
          >
            Create Account
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
