import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { calculateAge } from "../../ageCaculator.js";
import { assets } from "../../assets/assets_admin/assets.js";

const DoctorAppointments = () => {
  const URI = import.meta.env.VITE_BACKEND_URI;
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyAppointments = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(URI + "/api/doctor/my-appointments", {
        withCredentials: true,
      });
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (err) {
      toast.error(err.response?.data.message || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const approveAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.get(
        `${URI}/api/doctor/appointment/${appointmentId}`,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchMyAppointments();
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.delete(
        `${URI}/api/doctor/appointment/${appointmentId}`,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchMyAppointments();
      }
    } catch (err) {
      toast.error(err.response?.data.message);
    }
  };

  useEffect(() => {
    fetchMyAppointments();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg w-64 mb-8"></div>
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            My Appointments
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage your upcoming and past appointments
          </p>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Completed</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
        {appointments.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No appointments found
            </h3>
            <p className="text-gray-500">
              You don't have any appointments yet.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table Header */}
            <div className="hidden lg:grid grid-cols-[0.5fr_2.5fr_1fr_0.8fr_2fr_1fr_1fr_1.2fr] bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-6 py-4">
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                #
              </div>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Patient
              </div>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Payment
              </div>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Age
              </div>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date & Time
              </div>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Fees
              </div>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </div>
              <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                Actions
              </div>
            </div>

            {/* Appointments List */}
            <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
              {appointments.map((appointment, index) => {
                const patient = appointment?.patient;
                const details = patient?.additionalDetails;
                const name = patient?.name || "User";
                const image = details?.image;

                return (
                  <div
                    key={appointment._id}
                    className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
                  >
                    {/* Desktop Layout */}
                    <div className="hidden lg:grid grid-cols-[0.5fr_2.5fr_1fr_0.8fr_2fr_1fr_1fr_1.2fr] items-center px-6 py-5">
                      {/* Index */}
                      <div className="text-gray-700 font-semibold text-sm">
                        {index + 1}
                      </div>

                      {/* Patient */}
                      <div className="flex items-center gap-4">
                        {image ? (
                          <div className="relative">
                            <img
                              src={image}
                              alt={name}
                              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md group-hover:shadow-lg transition-all duration-300"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-all duration-300">
                            {name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <h4 className="text-gray-900 font-semibold truncate">
                            {name}
                          </h4>
                          <p className="text-sm text-gray-500 truncate">
                            Patient ID: {patient?._id?.slice(-8) || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Payment Status */}
                      <div>
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                            appointment.paymentStatus === "paid"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              appointment.paymentStatus === "paid"
                                ? "bg-emerald-500"
                                : "bg-amber-500"
                            }`}
                          ></div>
                          {appointment.paymentStatus}
                        </span>
                      </div>

                      {/* Age */}
                      <div className="text-gray-700 font-medium">
                        {calculateAge(details?.dob)} yrs
                      </div>

                      {/* Date & Time */}
                      <div className="space-y-1">
                        <div className="text-gray-900 font-semibold text-sm">
                          {new Date(appointment.slotDate).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </div>
                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md inline-block">
                          {appointment.slotTime}
                        </div>
                      </div>

                      {/* Fees */}
                      <div className="text-gray-900 font-bold text-lg">
                        ₹{appointment.amount}
                      </div>

                      {/* Status */}
                      <div>
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold capitalize shadow-sm ${
                            !appointment.isCompleted
                              ? "bg-blue-100 text-blue-800 border border-blue-200"
                              : "bg-green-100 text-green-800 border border-green-200"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              !appointment.isCompleted
                                ? "bg-blue-500"
                                : "bg-green-500"
                            }`}
                          ></div>
                          {appointment?.isCompleted ? "Completed" : "Pending"}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 justify-center">
                        {!appointment.isCompleted && (
                          <>
                            <button title="Cancel Appointment">
                              <img
                                onClick={() =>
                                  cancelAppointment(appointment._id)
                                }
                                src={assets.cancel_icon}
                                alt="Cancel"
                                className="w-10 h-10 opacity-70 group-hover/btn:opacity-100 transition-opacity"
                              />
                            </button>
                            <button title="Mark as Completed">
                              <img
                                onClick={() =>
                                  approveAppointment(appointment._id)
                                }
                                src={assets.tick_icon}
                                alt="Complete"
                                className="w-10 h-10 opacity-70 group-hover/btn:opacity-100 transition-opacity"
                              />
                            </button>
                          </>
                        )}
                        {appointment.isCompleted && (
                          <div className="px-3 py-2 text-xs text-gray-400 font-medium">
                            No actions
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
