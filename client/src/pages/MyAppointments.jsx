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
      const { data } = await axios.get(URI + "/api/appointment", {
        withCredentials: true,
      });

      console.log(data);
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (err) {
      console.log(err.response.data.message);
    }
  };

  const cancelAppointment = async (id) => {
    try {
      setLoading(true);
      const { data } = await axios.delete(
        `${URI}/api/appointment/cancel/${id}`,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchAppointmentDetails();
      }
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointmentDetails();
  }, [user]);

  return (
    <div className="p-6">
      {loading && <Loader />}
      <p className="text-2xl font-semibold mb-6 text-gray-800">
        My Appointments
      </p>
      <div className="space-y-6">
        {appointments.length > 0 &&
          appointments.map((appointment) => (
            <div
              key={appointment._id}
              className="flex flex-col md:flex-row justify-between items-start bg-white border border-gray-200 rounded-xl p-4 gap-6"
            >
              {/* Doctor Image */}
              <div className="w-full bg-primary/50 rounded-lg md:w-[140px] h-[160px] flex-shrink-0">
                <img
                  src={appointment?.doctor?.image}
                  alt="Doctor"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Info Section */}
              <div className="flex-1 text-gray-700 text-sm space-y-1">
                <p className="text-base font-medium">
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
                  {new Date(appointment?.slotDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  | {appointment?.slotTime}
                </p>
              </div>

              {/* Action Buttons - Vertical Alignment */}
              <div className="flex flex-col gap-3 mt-10 md:mt-10">
                {appointment?.status !== "cancelled" && (
                  <button className="border border-gray-200 text-gray-800 px-6 py-2 rounded-md text-sm hover:bg-primary hover:text-white transition">
                    Pay Online
                  </button>
                )}
                {appointment?.status !== "cancelled" && (
                  <button
                    onClick={() => cancelAppointment(appointment._id)}
                    className="border border-gray-200 text-gray-800 px-6 py-2 rounded-md text-sm hover:bg-red-500 hover:text-white transition"
                  >
                    Cancel Appointment
                  </button>
                )}
                {appointment?.status === "cancelled" && (
                  <button className="sm:min-w-48 py-2 border border-red-500 text-red-500">
                    Appointment Cancelled
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyAppointments;
