import React from "react";
import AdminNavbar from "../../components/admin/AdminNavbar";
import AdminSidebar from "../../components/admin/AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Navbar at the top */}
      <AdminNavbar />

      {/* Content area with sidebar + main content side by side */}
      <div className="flex flex-1">
        {/* Sidebar on the left */}
        <aside className="w-[240px] border-r bg-white shadow-sm">
          <AdminSidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
