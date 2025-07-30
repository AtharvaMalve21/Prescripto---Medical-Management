import { createContext, useState, useEffect } from "react";
import axios from "axios";
import Loader from "../components/Loader.jsx";

export const DoctorContext = createContext({});

export const DoctorContextProvider = ({ children }) => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(false);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const doctorProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(URI + "/api/auth/doctor-profile", {
        withCredentials: true,
      });
      console.log(doctor);
      if (data.success) {
        setDoctor(data.data);
        setIsDoctorLoggedIn(true);
      }
    } catch (err) {
      console.log(err.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    doctor,
    setDoctor,
    isDoctorLoggedIn,
    setIsDoctorLoggedIn,
  };

  useEffect(() => {
    doctorProfile();
  }, []);

  return (
    <DoctorContext.Provider value={value}>
      {loading ? <Loader /> : children}
    </DoctorContext.Provider>
  );
};
