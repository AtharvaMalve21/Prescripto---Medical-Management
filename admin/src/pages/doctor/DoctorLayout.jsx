import React from "react";
import DoctorNavbar from "../../components/doctor/DoctorNavbar.jsx";
import DoctorSidebar from "../../components/doctor/DoctorSidebar";

const DoctorLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Navbar at the top */}
      <DoctorNavbar />

      {/* Content area with sidebar + main content side by side */}
      <div className="flex flex-1">
        {/* Sidebar on the left */}
        <aside className="w-[240px] border-r bg-white shadow-sm">
          <DoctorSidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DoctorLayout;
