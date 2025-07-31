import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { calculateAge } from "../../ageCaculator.js";
import { assets } from "../../assets/assets_admin/assets.js";
import Loader from "../../components/Loader.jsx";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const URI = import.meta.env.VITE_BACKEND_URI;
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get(`${URI}/api/admin/appointments`, {
        withCredentials: true,
      });

      console.log(data);
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (err) {
      console.log(err.message);
      toast.error(
        err.response?.data.message || "Failed to fetch appointments."
      );
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(
        `${URI}/api/admin/appointment/${appointmentId}`,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchAppointments();
      }
    } catch (err) {
      console.log(err.message);
      toast.error(err.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto mt-12 px-4">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">
        All Appointments
      </h2>

      {loading && <Loader />}

      <div className="bg-white border rounded-2xl shadow-xl overflow-y-auto max-h-[75vh]">
        {/* Table Header */}
        <div className="hidden sm:grid sticky top-0 z-10 bg-gray-100 grid-cols-[0.5fr_2.5fr_0.7fr_2fr_2.5fr_0.7fr_1fr] px-6 py-4 text-sm font-semibold text-gray-700 border-b">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Status</p>
        </div>

        {/* Table Rows */}
        {appointments.map((item, index) => {
          const patient = item.patient;
          const doctor = item.doctor;
          const age = calculateAge(patient?.additionalDetails?.dob);
          const img = patient?.additionalDetails?.image;
          const initials = getInitials(patient?.name);

          return (
            <div
              key={item._id}
              className="grid grid-cols-1 sm:grid-cols-[0.5fr_2.5fr_0.7fr_2fr_2.5fr_0.7fr_1fr] px-6 py-5 border-b items-center text-sm text-gray-800 hover:bg-primary/10 transition-all"
            >
              <p className="font-medium">{index + 1}</p>

              {/* Patient Info */}
              <div className="flex items-center gap-3">
                {img ? (
                  <img
                    src={img}
                    onError={(e) => (e.target.style.display = "none")}
                    alt={patient?.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-indigo-100 text-indigo-600 rounded-full font-bold text-sm">
                    {initials}
                  </div>
                )}
                <div>
                  <p className="font-semibold">{patient?.name}</p>
                  <p className="text-xs text-gray-500">{patient?.email}</p>
                </div>
              </div>

              <p className="text-sm">{age > 0 ? age : "NA"}</p>

              {/* Date & Time */}
              <div>
                <p className="font-medium">{item.slotDate}</p>
                <p className="text-xs text-gray-500">{item.slotTime}</p>
              </div>

              {/* Doctor Info */}
              <div className="flex items-center gap-3">
                <img
                  src={doctor?.image}
                  onError={(e) => (e.target.style.display = "none")}
                  alt={doctor?.name || "Doctor"}
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                />
                <div>
                  <p className="font-semibold">{doctor?.name}</p>
                  <p className="text-xs text-gray-500">{doctor?.speciality}</p>
                </div>
              </div>

              <p className="font-medium text-gray-700">₹{item.amount}</p>

              {/* Status / Action */}
              <div>
                {item?.status === "cancelled" ? (
                  <p className="text-red-400 text-xs font-medium">Cancelled</p>
                ) : (
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-10 h-10 hover:scale-105 transition-all cursor-pointer duration-500"
                    src={assets.cancel_icon}
                    alt=""
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AllAppointments;
