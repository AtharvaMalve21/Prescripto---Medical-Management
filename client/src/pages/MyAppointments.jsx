import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AppointmentContext } from "../context/AppointmentContext.jsx";
import { UserContext } from "../context/UserContext.jsx";
import Loader from "../components/Loader.jsx";

const MyAppointments = () => {
  const { user } = useContext(UserContext);
  const { appointments, setAppointments } = useContext(AppointmentContext);
  const [loading, setLoading] = useState(false);
  const URI = import.meta.env.VITE_BACKEND_URI;

  const fetchAppointmentDetails = async () => {
    try {
      const { data } = await axios.get(`${URI}/api/appointment`, {
        withCredentials: true,
      });
      if (data.success) setAppointments(data.data);
    } catch (err) {
      console.log(err.response?.data?.message);
    }
  };

  const cancelAppointment = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(
        `${URI}/api/appointment/cancel/${id}`,
        {
          withCredentials: true,
        }
      );
      if (data.success) {
        toast.success(data.message);
        await fetchAppointmentDetails();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error canceling appointment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentDetails();
  }, [user]);

  return (
    <div className="p-4 sm:p-6">
      {loading && <Loader />}
      <p className="text-xl sm:text-2xl font-semibold mb-6 text-gray-800">
        My Appointments
      </p>

      <div className="space-y-6">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4"
            >
              {/* Card Content */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Doctor Image */}
                <div className="w-full sm:w-[140px] h-[200px] sm:h-[160px] bg-primary/50 rounded-lg overflow-hidden">
                  <img
                    src={appointment?.doctor?.image}
                    alt="Doctor"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Doctor Info */}
                <div className="flex-1 text-sm text-gray-700 space-y-2">
                  <p className="text-base font-semibold">
                    {appointment?.doctor?.name}
                  </p>
                  <p className="text-gray-500">
                    {appointment?.doctor?.speciality}
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span> <br />
                    {appointment?.doctor?.address}
                  </p>
                  <p>
                    <span className="font-semibold">Date & Time:</span>{" "}
                    {new Date(appointment?.slotDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      }
                    )}{" "}
                    | {appointment?.slotTime}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end items-end">
                {appointment?.status !== "cancelled" && (
                  <button className="w-full sm:w-auto border border-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-primary hover:text-white transition">
                    Pay Online
                  </button>
                )}
                {appointment?.status !== "cancelled" && (
                  <button
                    onClick={() => cancelAppointment(appointment._id)}
                    className="w-full sm:w-auto border border-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm hover:bg-red-500 hover:text-white transition"
                  >
                    Cancel Appointment
                  </button>
                )}
                {appointment?.status === "cancelled" && (
                  <div className="w-full sm:w-auto py-2 px-4 text-center border border-red-500 text-red-500 rounded-md text-sm">
                    Appointment Cancelled
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">You have no appointments yet.</p>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
