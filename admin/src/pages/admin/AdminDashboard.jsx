import React, { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AdminContext } from "../../context/AdminContext.jsx";

const AdminDashboard = () => {
  const {
    admin: email,
    setAdmin,
    setIsAdminLoggedIn,
  } = useContext(AdminContext);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(URI + "/api/admin/logout", {
        withCredentials: true,
      });
      if (data.success) {
        setAdmin(null);
        setIsAdminLoggedIn(false);
        toast.success(data.message);
        navigate("/");
      }
    } catch (err) {
      
      toast.error(err.response?.data.message);
    }
  };

  return (
    <div>
      AdminDashboard Page {email}
      <br />
      <button onClick={logoutHandler}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
