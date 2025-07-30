import React, { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const DoctorDashboard = () => {
  const { doctor, setDoctor, setIsDoctorLoggedIn } = useContext(DoctorContext);
  const navigate = useNavigate();
  const URI = import.meta.env.VITE_BACKEND_URI;

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(URI + "/api/auth/logout-doctor", {
        withCredentials: true,
      });
      if (data.success) {
        setDoctor(null);
        setIsDoctorLoggedIn(false);
        toast.success(data.message);
        navigate("/");
      }
    } catch (err) {
      console.log(err.message);
      toast.error(err.response?.data.message);
    }
  };

  return (
    <div>
      DoctorDashboard Page
      <p>{doctor?.name}</p>
      <br />
      <button onClick={logoutHandler}>Logout</button>
    </div>
  );
};

export default DoctorDashboard;
