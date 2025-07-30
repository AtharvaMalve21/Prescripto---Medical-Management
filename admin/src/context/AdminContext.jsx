import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AdminContext = createContext({});

export const AdminContextProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const adminProfile = async () => {
    try {
      const { data } = await axios.get(URI + "/api/admin/profile", {
        withCredentials: true,
      });
      console.log(data);
      if (data.success) {
        setAdmin(data.data);
        setIsAdminLoggedIn(true);
      }
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const value = {
    admin,
    setAdmin,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
  };

  useEffect(() => {
    adminProfile();
  }, [admin]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
