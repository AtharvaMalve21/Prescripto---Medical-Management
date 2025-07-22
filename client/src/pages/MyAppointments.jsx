import React, { useContext, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AppointmentContext } from "../context/AppointmentContext.jsx";
import { UserContext } from "../context/UserContext.jsx";
import { Navigate } from "react-router-dom";

const MyAppointments = () => {
  const { user } = useContext(UserContext);
  const { appointments, setAppointments } = useContext(AppointmentContext);

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
      toast.error(err.response?.data.message);
    }
  };

  useEffect(() => {
    fetchAppointmentDetails();
  }, [user]);

  return (
    <div className="p-6">
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
                  {appointment?.patient?.name}
                </p>
                <p className="text-gray-500">
                  {appointment?.doctor?.speciality}
                </p>
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {appointment?.doctor?.address}
                </p>
              </div>

              {/* Action Buttons - Vertical Alignment */}
              <div className="flex flex-col gap-3 mt-10 md:mt-10">
                <button className="border border-gray-200 text-gray-800 px-6 py-2 rounded-md text-sm hover:bg-black hover:text-white transition">
                  Pay Online
                </button>
                <button className="border border-gray-200 text-gray-800 px-6 py-2 rounded-md text-sm hover:bg-black hover:text-white transition">
                  Cancel Appointment
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default MyAppointments;
