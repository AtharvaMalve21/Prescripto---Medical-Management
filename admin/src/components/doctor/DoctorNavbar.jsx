import React, { useContext, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { assets } from "../../assets/assets_admin/assets.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { LogOut } from "lucide-react";
import Loader from "../Loader.jsx";

const DoctorNavbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { doctor, setDoctor, setIsDoctorLoggedIn } = useContext(DoctorContext);
  const navigate = useNavigate();
  const URI = import.meta.env.VITE_BACKEND_URI;
  const [loading, setLoading] = useState(false);

  const logoutHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(URI + "/api/auth/logout-doctor", {
        withCredentials: true,
      });
      if (data.success) {
        setDoctor(null);
        setIsDoctorLoggedIn(false);
        toast.success(data.message);
        navigate("/");
      }
    } catch (err) {
      console.log(err.message);
      toast.error(err.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white relative">
      {loading && <Loader />}
      {/* Left: Logo + Panel Label */}
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
        <img
          className="w-36 sm:w-40 cursor-pointer"
          src={assets.admin_logo}
          alt="logo"
        />
        <p className="hidden sm:block text-sm px-3 py-1 border border-primary bg-primary/10 text-primary font-medium rounded-full shadow-sm">
          Doctor Panel
        </p>
      </div>

      {/* Right: Avatar + Dropdown */}
      <div
        className="relative group cursor-pointer"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        {doctor?.image ? (
          <img
            src={doctor.image}
            alt="doctor-avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-primary hover:scale-105 hover:shadow-md transition-all duration-300"
          />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold text-lg uppercase hover:scale-105 hover:shadow-md transition-all duration-300">
            {doctor?.name?.charAt(0)}
          </div>
        )}

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-10">
            <button
              onClick={logoutHandler}
              className="w-full flex items-center gap-2 text-left px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorNavbar;
