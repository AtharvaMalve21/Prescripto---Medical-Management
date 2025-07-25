import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Contact from "./pages/Contact.jsx";
import Register from "./pages/Register";
import Login from "./pages/Login.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import MyAppointments from "./pages/MyAppointments.jsx";
import Doctors from "./pages/Doctors.jsx";
import NotFound from "./pages/NotFound.jsx";
import Appointment from "./pages/Appointment.jsx";
import About from "./pages/About.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import { UserContext } from "./context/UserContext.jsx";

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="mx-4 sm:mx-[10%]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/appointment/:id" element={<Appointment />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
