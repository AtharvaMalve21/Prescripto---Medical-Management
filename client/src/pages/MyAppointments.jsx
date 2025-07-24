// ✅ Your existing imports and context setup remain unchanged
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AppointmentContext } from "../context/AppointmentContext.jsx";
import { UserContext } from "../context/UserContext.jsx";
import Loader from "../components/Loader.jsx";
import { assets } from "../assets/assets_frontend/assets.js";

const MyAppointments = () => {
  const { user } = useContext(UserContext);
  const { appointments, setAppointments } = useContext(AppointmentContext);
  const [loading, setLoading] = useState(false);
  const URI = import.meta.env.VITE_BACKEND_URI;
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(false);

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

  const initPayment = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Prescripto Healthcare",
      description: "Appointment Consultation Fee Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          setLoading(true);
          const { data } = await axios.post(
            URI + "/api/payment/verify-payment",
            response,
            { withCredentials: true }
          );
          if (data.success) {
            toast.success(data.message);
            setPaymentSuccess(true);
            setPaymentMethod(false);
            await fetchAppointmentDetails();
          }
        } catch (err) {
          console.log(err.message);
          console.log(err.response?.data?.message);
          toast.error(err.response?.data?.message);
        } finally {
          setLoading(false);
        }
      },
      theme: {
        color: "#2C7BE5",
      },
      prefill: {
        name: "Atharva Malve",
        email: "atharva@example.com",
        contact: "1234567890",
      },
    };

    const rz = new window.Razorpay(options);
    rz.open();
  };

  const paymentRazorpay = async (id) => {
    try {
      setPaymentMethod(true);
      setLoading(true);
      const { data } = await axios.get(`${URI}/api/payment/${id}`, {
        withCredentials: true,
      });

      if (data.success) {
        initPayment(data.data);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to initialize Razorpay"
      );
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
      
      {paymentSuccess && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-[90%] sm:w-[400px] rounded-xl shadow-lg p-6 text-center space-y-4">
            <h2 className="text-xl font-semibold text-green-600">
              Payment Successful!
            </h2>
            <p className="text-gray-700">
              Your appointment has been confirmed and marked as paid. Thank you!
            </p>
            <button
              onClick={() => setPaymentSuccess(false)}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

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
              {/* Doctor Info */}
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <div className="w-full sm:w-[140px] h-[200px] sm:h-[160px] bg-primary/50 rounded-lg overflow-hidden">
                  <img
                    src={appointment?.doctor?.image}
                    alt="Doctor"
                    className="w-full h-full object-cover"
                  />
                </div>

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
              <div className="flex flex-col sm:flex-col gap-3 items-stretch sm:items-end w-full sm:w-auto">
                {appointment?.status !== "cancelled" &&
                  appointment?.paymentStatus === "paid" && (
                    <button
                      disabled
                      className="w-full sm:w-52 py-2 px-4 border border-green-300 bg-green-50 text-green-700 text-sm shadow-sm cursor-not-allowed"
                    >
                      Paid
                    </button>
                  )}

                {paymentMethod &&
                  appointment?.paymentStatus === "unpaid" &&
                  appointment?.status !== "cancelled" && (
                    <div className="w-full sm:w-52 flex gap-3 justify-between">
                      <button
                        onClick={() => paymentRazorpay(appointment._id)}
                        className="flex-1 py-2 px-3 border border-blue-500 bg-white text-blue-600 hover:bg-blue-500 hover:text-white transition-colors text-sm shadow-sm"
                      >
                        <img
                          src={assets.razorpay_logo}
                          alt="Razorpay"
                          className="h-5 mx-auto"
                        />
                        Razorpay
                      </button>

                      <button
                        onClick={() => toast("Stripe is coming soon!")}
                        className="flex-1 py-2 px-3 border border-gray-300 bg-gray-50 text-gray-700 hover:bg-blue-600 hover:text-white transition-colors duration-200 text-sm rounded shadow-sm"
                      >
                        <img
                          src={assets.stripe_logo}
                          alt="Stripe"
                          className="h-5 mx-auto"
                        />
                        Stripe
                      </button>
                    </div>
                  )}

                {appointment?.status !== "cancelled" &&
                  appointment?.paymentStatus === "unpaid" &&
                  !paymentMethod && (
                    <button
                      onClick={() => setPaymentMethod(true)}
                      className="w-full sm:w-52 py-2 px-4 text-sm font-medium border border-primary bg-white text-primary/90 hover:bg-primary hover:text-white transition-colors duration-200  shadow-sm"
                    >
                      Pay Online
                    </button>
                  )}

                {appointment?.status !== "cancelled" && (
                  <button
                    onClick={() => cancelAppointment(appointment._id)}
                    className="w-full sm:w-52 py-2 px-4 text-sm font-medium border border-red-500 bg-white text-red-600 hover:bg-red-500 hover:text-white transition-colors duration-200 shadow-sm"
                  >
                    Cancel Appointment
                  </button>
                )}

                {appointment?.status === "cancelled" && (
                  <button
                    disabled
                    className="w-full sm:w-52 py-2 px-4 border border-gray-300 bg-gray-100 text-gray-400 text-sm shadow-sm cursor-not-allowed"
                  >
                    Appointment Cancelled
                  </button>
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
