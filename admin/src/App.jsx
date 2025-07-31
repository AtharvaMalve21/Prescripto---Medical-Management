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
import DoctorLayout from "./pages/doctor/DoctorLayout";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import NotFound from "./pages/NotFound";
import DoctorProfile from "./pages/doctor/DoctorProfile";

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
            <DoctorLayout>
              <DoctorDashboard />
            </DoctorLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor-appointments"
        element={
          <ProtectedRoute isAllowed={isDoctorLoggedIn}>
            <DoctorLayout>
              <DoctorAppointments />
            </DoctorLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/doctor-profile"
        element={
          <ProtectedRoute isAllowed={isDoctorLoggedIn}>
            <DoctorLayout>
              <DoctorProfile />
            </DoctorLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
