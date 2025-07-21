import { createContext, useState } from "react";

export const DoctorContext = createContext({});

export const DoctorContextProvider = ({ children }) => {
  const [doctors, setDoctors] = useState([]);

  return (
    <DoctorContext.Provider value={{ doctors, setDoctors }}>
      {children}
    </DoctorContext.Provider>
  );
};
