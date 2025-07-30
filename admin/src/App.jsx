import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { AdminContext } from "./context/AdminContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import { DoctorContext } from "./context/DoctorContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AllAppointments from "./pages/admin/AllAppointments";
import AddDoctor from "./pages/admin/AddDoctor";
import DoctorsList from "./pages/admin/DoctorsList";
import AdminLayout from "./pages/admin/AdminLayout";

const App = () => {
  const { admin, isAdminLoggedIn } = useContext(AdminContext);
  const { doctor, isDoctorLoggedIn } = useContext(DoctorContext);

  return (

    
    <Routes>
      {/* Public Route */}
      <Route
        path="/"
        element={
          !isAdminLoggedIn && !isDoctorLoggedIn ? (
            <Login />
          ) : (
            <Navigate to={isAdminLoggedIn ? "/admin" : "/doctor"} />
          )
        }
      />


      {/* Admin Protected Route */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute isAllowed={isAdminLoggedIn}>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/all-appointments"
        element={
          <ProtectedRoute isAllowed={isAdminLoggedIn}>
            <AdminLayout>
              <AllAppointments />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-doctor"
        element={
          <ProtectedRoute isAllowed={isAdminLoggedIn}>
            <AdminLayout>
              <AddDoctor />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctors-list"
        element={
          <ProtectedRoute isAllowed={isAdminLoggedIn}>
            <AdminLayout>
              <DoctorsList />
            </AdminLayout>
          </ProtectedRoute>
        }
      />


      {/* Doctor Protected Route */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute isAllowed={isDoctorLoggedIn}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
