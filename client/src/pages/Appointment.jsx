import React, { useContext, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { assets } from "../assets/assets_frontend/assets.js";
import Loader from "../components/Loader.jsx";
import { UserContext } from "../context/UserContext.jsx";

const Appointment = () => {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [doctor, setDoctor] = useState(null);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [loading, setLoading] = useState(false);
  const [similarDoctors, setSimilarDoctors] = useState([]);
  const URI = import.meta.env.VITE_BACKEND_URI;
  const [doctorSlots, setDoctorSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  console.log(appointmentDate);
  console.log(appointmentTime);

  const navigate = useNavigate();

  const bookAppointment = async () => {
    try {
      setLoading(true);

      const formattedDate = new Date(appointmentDate)
        .toISOString()
        .split("T")[0];

      if (!formattedDate || !appointmentTime) {
        return toast.error("Appointment details are required.");
      }

      const { data } = await axios.post(
        `${URI}/api/appointment/book/${id}`,
        { slotDate: formattedDate, slotTime: appointmentTime },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);

        // Refetch doctor and update slot list immediately
        const { data: updatedDoctorRes } = await axios.get(
          `${URI}/api/doctor/${id}`
        );
        if (updatedDoctorRes.success) {
          setDoctor(updatedDoctorRes.data);
          await fetchAvailableSlots(updatedDoctorRes.data);
        }

        navigate("/my-appointments");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Booking failed");
      if (!user) navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (doctorData) => {
    const booked = doctorData?.slots_booked || {};
    const today = new Date();
    const allSlots = [];

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const dateKey = currentDate.toISOString().split("T")[0];

      const endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        const now = new Date();
        if (now.getHours() >= 21) {
          allSlots.push([]);
          continue;
        }

        const nextSlot = new Date(now);
        nextSlot.setSeconds(0);
        nextSlot.setMilliseconds(0);
        nextSlot.setMinutes(now.getMinutes() < 30 ? 30 : 0);
        if (now.getMinutes() >= 30) {
          nextSlot.setHours(now.getHours() + 1);
        }

        currentDate.setHours(nextSlot.getHours(), nextSlot.getMinutes(), 0, 0);
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      const timeSlots = [];

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        const isBooked = booked[dateKey]?.includes(formattedTime);
        if (!isBooked) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      allSlots.push(timeSlots);
    }

    setDoctorSlots(allSlots);

    // ✅ Set default date and slotIndex only if first slot exists
    const firstValidDay = allSlots.findIndex((day) => day.length > 0);
    if (firstValidDay !== -1) {
      setSlotIndex(firstValidDay);
      setAppointmentDate(allSlots[firstValidDay][0].datetime);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const { data: doctorRes } = await axios.get(`${URI}/api/doctor/${id}`);
        if (doctorRes.success) {
          const fetchedDoctor = doctorRes.data;
          setDoctor(fetchedDoctor);
          await fetchAvailableSlots(fetchedDoctor);

          const { data: similarRes } = await axios.get(
            `${URI}/api/doctor/filter?speciality=${fetchedDoctor.speciality}`
          );

          if (similarRes.success) {
            const filtered = similarRes.data.filter((doc) => doc._id !== id);
            setSimilarDoctors(filtered);
          }
        }
      } catch (err) {
        toast.error(err?.response?.data?.message || "Something went wrong");
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="p-4 sm:p-6">
      {loading && <Loader />}

      {/* Doctor Info */}
      {doctor && (
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="sm:max-w-72 w-full">
            <img
              className="w-full h-auto bg-primary object-cover rounded-xl"
              src={doctor.image}
              alt={doctor.name}
            />
          </div>
          <div className="flex-1 border border-gray-300 rounded-xl p-6 bg-white shadow-sm mt-4 sm:mt-0">
            <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
              {doctor.name}
              <img
                className="w-5 h-5"
                src={assets.verified_icon}
                alt="verified"
              />
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-2">
              <span>
                {doctor.degree} - {doctor.speciality}
              </span>
              <span className="px-2 py-0.5 border rounded-full text-xs">
                {doctor.experience} {doctor.experience === 1 ? "year" : "years"}
              </span>
            </div>
            <div className="mt-4">
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900">
                About{" "}
                <img src={assets.info_icon} alt="info" className="w-4 h-4" />
              </p>
              <p className="text-sm text-gray-700 mt-1 max-w-3xl">
                {doctor.about}
              </p>
            </div>
            <p className="text-gray-600 font-medium mt-4">
              Appointment Fee:{" "}
              <span className="text-gray-800 font-semibold">
                $ {doctor.fees}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Booking Slots */}
      <div className="mt-8 font-medium text-gray-700">
        <p className="text-lg mb-3">Booking Slots</p>

        <div className="flex gap-4 items-center w-full overflow-x-auto pb-2">
          {doctorSlots.length > 0 &&
            doctorSlots.map((item, index) => (
              <div
                key={index}
                className={`min-w-[100px] min-h-[150px] px-5 py-6 rounded-full cursor-pointer flex flex-col items-center justify-center transition duration-200
                  ${
                    slotIndex === index
                      ? "bg-primary text-white shadow-md"
                      : "bg-white text-gray-800 border border-gray-200 hover:bg-blue-50"
                  }`}
                onClick={() => {
                  setSlotIndex(index);
                  if (item.length > 0) {
                    setAppointmentDate(item[0].datetime);
                  }
                }}
              >
                <p className="capitalize text-xl">
                  {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                </p>
                <p className="text-xl">
                  {item[0] && item[0].datetime.getDate()}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Slot Times */}
      <div className="flex flex-wrap sm:flex-nowrap gap-3 mt-4 pb-1 max-w-full overflow-x-auto">
        {doctorSlots.length > 0 &&
          doctorSlots[slotIndex].map((item, index) => (
            <p
              onClick={() => {
                setSlotTime(item.time);
                setAppointmentTime(item.time);
              }}
              key={index}
              className={`text-sm font-medium flex-shrink-0 px-6 py-3 rounded-[30px] cursor-pointer whitespace-nowrap transition duration-200
          ${
            item.time === slotTime
              ? "bg-primary text-white shadow-md"
              : "border border-gray-300 text-gray-400 hover:bg-gray-100"
          }`}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
      </div>

      <button
        onClick={bookAppointment}
        className="bg-primary hover:bg-primary-dark transition-colors duration-300 text-white text-base font-medium px-10 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-light m-6"
      >
        Book an Appointment
      </button>

      {/* Similar Doctors */}
      <div className="flex flex-col items-center gap-4 my-16 to-gray-900 md:mx-10">
        <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
        <p className="sm:w-1/3 text-center text-sm">
          Simply browse through our extensive list of trusted doctors.
        </p>
        <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
          {similarDoctors.map((doctor) => (
            <div
              onClick={() => {
                navigate(`/appointment/${doctor._id}`);
                scrollTo(0, 0);
              }}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
              key={doctor._id}
            >
              <img className="bg-blue-50" src={doctor.image} />
              <div className="p-4">
                {doctor.available && (
                  <div className="flex items-center gap-2 text-sm text-center text-green-500">
                    <p className="w-2 h-2 bg-green-500 rounded-full"></p>
                    <p>Available</p>
                  </div>
                )}
                <p className="text-gray-900 text-lg font-medium">
                  {doctor.name}
                </p>
                <p className="text-gray-600 text-sm">{doctor.speciality}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          className="mt-10 px-8 py-3 rounded-full bg-primary/10 text-primary font-semibold shadow-sm hover:bg-primary/20 hover:text-primary-dark transition duration-200"
          onClick={() => {
            navigate("/doctors");
            scrollTo(0, 0);
          }}
        >
          View More
        </button>
      </div>
    </div>
  );
};

export default Appointment;
