import React, { useContext } from "react";
import { LogOut } from "lucide-react";
import axios from "axios";
import { assets } from "../../assets/assets_admin/assets.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { DoctorContext } from "../../context/DoctorContext.jsx";
import Loader from "../Loader.jsx";
import { useState } from "react";


const DoctorNavbar = () => {
  const { setDoctor, setIsDoctorLoggedIn } = useContext(DoctorContext);
  const [loading, setLoading] = useState(false);

  const URI = import.meta.env.VITE_BACKEND_URI;
  const navigate = useNavigate();

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
      toast.error(err.response?.data.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b border-gray-200 bg-white shadow-md z-50">
      {loading && <Loader />}
      {/* Logo and Label */}
      <div className="flex items-center gap-3">
        <img
          className="w-36 sm:w-40 cursor-pointer"
          src={assets.admin_logo}
          alt="logo"
        />
        <span className="hidden sm:inline-block text-sm px-3 py-1 bg-primary/10 text-primary border border-primary rounded-full shadow-sm">
          Doctor Panel
        </span>
      </div>

      {/* Logout Button - moved right */}
      <div className="relative">
        <button
          onClick={logoutHandler}
          className="group flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary hover:border-primary-dark font-medium text-sm rounded-full transition-all duration-200 shadow-sm"
        >
          <LogOut className="w-4 h-4 group-hover:rotate-[-15deg] transition-transform duration-300" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default DoctorNavbar;
