import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const Appointment = () => {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const fetchDoctorDetails = async () => {
    try {
      const { data } = await axios.get(`${URI}/api/doctor/${id}`);

      console.log(data);

      if (data.success) {
        setDoctor(data.data);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  useEffect(() => {
    fetchDoctorDetails();
  }, [id]);

  return (
    <div>
      {doctor && (
        <div>
          <p>{doctor.name}</p>
        </div>
      )}
    </div>
  );
};

export default Appointment;
