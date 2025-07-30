import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/Loader.jsx";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(false);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(URI + "/api/admin/doctors", {
        withCredentials: true,
      });

      console.log(data);
      if (data.success) {
        setDoctors(data.data);
      }
    } catch (err) {
      console.log(err.message);
      toast.error(err.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleAvailability = async (doctorId) => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${URI}/api/admin/doctor/${doctorId}`, {
        withCredentials: true,
      });
      if (data.success) {
        toast.success(data.message);
        await fetchDoctors();
      }
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      {loading && <Loader />}
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {doctors.map((doctor) => (
          <div
            className="border border-indigo-200 rounded-xl max-w-56 overflow-hidden cursor-pointer"
            key={doctor._id}
          >
            <img
              className="bg-indigo-50 hover:bg-primary transition-all duration-500"
              src={doctor.image}
              alt=""
            />
            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium ">
                {doctor.name}
              </p>
              <p className="text-zinc-600 text-sm">{doctor.speciality}</p>
              <div className="mt-3">
                <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-2">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={doctor.available}
                    onChange={() => toggleAvailability(doctor._id)}
                  />
                  <div className="w-14 h-7 bg-slate-300 rounded-full peer peer-checked:bg-indigo-600 transition-colors duration-200" />
                  <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-7" />
                  <span className="text-sm">
                    {doctor.available ? "Available" : "Unavailable"}
                  </span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
