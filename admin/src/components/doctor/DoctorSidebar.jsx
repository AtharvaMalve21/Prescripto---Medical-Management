import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../../assets/assets_admin/assets";

const navItemClass = ({ isActive }) =>
  `flex items-center gap-3 py-3.5 px-4 md:px-6 relative group transition-all duration-200 rounded-md
   ${
     isActive
       ? "text-primary font-medium bg-primary/10 before:absolute before:right-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary"
       : "text-gray-700 hover:bg-gray-100/90 hover:text-primary"
   }`;


const DoctorSidebar = () => {
  return (
    <div className="py-6">
      <ul className="space-y-1">
        <NavLink to="/doctor" className={navItemClass}>
          <img src={assets.home_icon} alt="dashboard" className="w-5" />
          <p>Dashboard</p>
        </NavLink>
        <NavLink to="/doctor-appointments" className={navItemClass}>
          <img
            src={assets.appointment_icon}
            alt="appointments"
            className="w-5"
          />
          <p>Appointments</p>
        </NavLink>

        <NavLink to="/doctor-profile" className={navItemClass}>
          <img src={assets.people_icon} alt="appointments" className="w-5" />
          <p>My Profile</p>
        </NavLink>
      </ul>
    </div>
  );
};

export default DoctorSidebar;
