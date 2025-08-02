import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export const DoctorContext = createContext({});


export const DoctorContextProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const fetchDoctorDetails = async () => {
    try {
      const { data } = await axios.get(URI + "/api/doctor");

      if (data.success) {
        setDoctors(data.data);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    fetchDoctorDetails();
  }, []);

  return (
    <DoctorContext.Provider value={{ doctors, setDoctors }}>
      {children}
    </DoctorContext.Provider>
  );
};
