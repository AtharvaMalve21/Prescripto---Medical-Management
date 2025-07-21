import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BadgeCheck } from "lucide-react";

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { doctors, setDoctors } = useContext(DoctorContext);
  const [specialities, setSpecialities] = useState([]);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const fetchDoctorDetails = async () => {
    try {
      const { data } = await axios.get(
        speciality
          ? `${URI}/api/doctor/filter?speciality=${speciality}`
          : URI + "/api/doctor"
      );

      if (data.success) {
        setDoctors(data.data);

        const allSpecialities = await axios.get(`${URI}/api/doctor`);
        const uniqueSpecialities = [
          ...new Set(allSpecialities.data.data.map((doc) => doc.speciality)),
        ];
        setSpecialities(uniqueSpecialities);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch doctors");
    }
  };

  useEffect(() => {
    fetchDoctorDetails();
  }, [speciality]);

  return (
    <div className="px-4 md:px-8 py-6">
      <p className="text-gray-600 text-base">
        Browse through the doctor specialists.
      </p>

      {/* Sidebar and Grid Container */}
      <div className="flex flex-col sm:flex-row gap-8 mt-6">
        {/* Sidebar */}
        <div className="sm:w-64 w-full">
          <ul className="flex sm:flex-col flex-wrap gap-3 sm:gap-4 text-sm text-gray-700">
            {specialities.map((sp) => (
              <li
                key={sp}
                onClick={() => navigate(`/doctors/${sp}`)}
                className={`w-full px-4 py-2 border rounded-lg cursor-pointer transition-all hover:bg-indigo-100 ${
                  speciality === sp
                    ? "bg-indigo-100 text-black font-medium"
                    : ""
                }`}
              >
                {sp}
              </li>
            ))}
          </ul>
        </div>

        {/* Doctors Grid */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {doctors.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">
              No doctors found.
            </p>
          ) : (
            doctors.map((doctor) => (
              <Link
                to={`/appointment/${doctor._id}`}
                key={doctor._id}
                className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 transition-transform duration-300 bg-white"
              >
                <img
                  className="bg-blue-50 w-full h-48 object-cover"
                  src={doctor.image}
                  alt={doctor.name}
                />
                <div className="p-4">
                  {doctor.available && (
                    <div className="flex items-center gap-2 text-sm text-green-500 mb-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>Available</span>
                    </div>
                  )}
                  <p className="text-gray-900 text-lg font-semibold">
                    {doctor.name}
                  </p>
                  <p className="text-gray-600 text-sm">{doctor.speciality}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
