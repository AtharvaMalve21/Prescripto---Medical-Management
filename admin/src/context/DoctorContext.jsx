import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const DoctorContext = createContext({});

export const DoctorContextProvider = ({ children }) => {
  const [doctor, setDoctor] = useState(null);
  const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(false);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const doctorProfile = async () => {
    try {
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
    <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>
  );
};
