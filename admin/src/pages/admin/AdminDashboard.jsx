import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { assets } from "../../assets/assets_admin/assets";

const AdminDashboard = () => {
  const URI = import.meta.env.VITE_BACKEND_URI;

  const [stats, setStats] = useState({
    totalPatients: "",
    totalDoctors: "",
    totalAppointments: "",
    latestAppointments: [],
  });

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${URI}/api/admin/stats`, {
        withCredentials: true,
      });
      if (data.success) setStats(data.data);
    } catch (err) {
      toast.error(err.response?.data.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.delete(
        `${URI}/api/admin/appointment/${appointmentId}`,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        fetchStats(); // Refresh stats
      }
    } catch (err) {
      toast.error(err.response?.data.message);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6  items-center justify-center mb-14 px-4">
        {[
          {
            label: "Patients",
            count: stats.totalPatients,
            color: "text-indigo-600",
            icon: assets.patients_icon,
          },
          {
            label: "Doctors",
            count: stats.totalDoctors,
            color: "text-green-600",
            icon: assets.doctor_icon,
          },
          {
            label: "Appointments",
            count: stats.totalAppointments,
            color: "text-rose-600",
            icon: assets.appointments_icon,
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl h-[100px] px-4 py-3 flex items-center shadow-md hover:shadow-lg transition-all duration-200"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4 shadow-sm">
              <img src={stat.icon} alt={stat.label} className="w-16 h-16 rounded-md" />
            </div>
            <div className="flex flex-col">
              <p className={`text-xl font-semibold ${stat.color}`}>
                {stat.count || 0}
              </p>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Appointments */}
      <div className="max-w-6xl  bg-white shadow-lg rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <img
            src={assets.appointment_icon}
            alt="appointments"
            className="w-6 h-6 text-primary"
          />
          <h3 className="text-xl font-semibold text-gray-800">
            Latest Appointments
          </h3>
        </div>

        {stats.latestAppointments.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-6">
            No recent appointments.
          </p>
        ) : (
          <ul className="space-y-4">
            {stats.latestAppointments.map((appointment) => (
              <li
                key={appointment._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-indigo-500 transition-all duration-300 bg-white"
              >
                {/* Doctor Details */}
                <div className="flex items-center gap-4">
                  {appointment?.doctor?.image ? (
                    <img
                      src={appointment?.doctor?.image}
                      alt={appointment?.doctor?.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-300"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">
                      ?
                    </div>
                  )}

                  <div>
                    <p className="font-medium text-gray-800">
                      {appointment?.doctor?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Booked on{" "}
                      {new Date(appointment?.slotDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>

                {/* Status or Cancel Icon */}
                <div className="mt-2 sm:mt-0 flex items-center gap-2">
                  {appointment.status === "cancelled" ? (
                    <span className="bg-red-100 text-red-600 px-3 py-1 text-xs rounded-full font-medium">
                      Cancelled
                    </span>
                  ) : (
                    <img
                      onClick={() => cancelAppointment(appointment._id)}
                      className="w-9 h-9 hover:scale-110 transition-all cursor-pointer duration-300"
                      src={assets.cancel_icon}
                      alt="cancel"
                    />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
