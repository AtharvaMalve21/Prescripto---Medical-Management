import { createContext, useEffect, useState } from "react";
import axios from "axios";
import Loader from "../components/Loader.jsx";

export const AdminContext = createContext({});

export const AdminContextProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const [loading, setLoading] = useState(true);

  const adminProfile = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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

  return (
    <AdminContext.Provider value={value}>
      {loading ? <Loader /> : children}
    </AdminContext.Provider>
  );
};
