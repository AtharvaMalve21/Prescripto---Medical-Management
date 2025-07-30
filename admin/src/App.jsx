import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import { AdminContext } from "./context/AdminContext";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import { DoctorContext } from "./context/DoctorContext";
import ProtectedRoute from "./components/ProtectedRoute";

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
            <AdminDashboard />
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
