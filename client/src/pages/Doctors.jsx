import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";
import axios from "axios";
import { toast } from "react-hot-toast";

const Doctors = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { doctors, setDoctors } = useContext(DoctorContext);
  const [specialities, setSpecialities] = useState([]);
  const [activeSpeciality, setActiveSpeciality] = useState(speciality || "");
  const [showFilter, setShowFilter] = useState(false);

  const URI = import.meta.env.VITE_BACKEND_URI;

  // Fetch all specialities once
  const fetchAllSpecialities = async () => {
    try {
      const { data } = await axios.get(`${URI}/api/doctor`);
      const uniqueSpecialities = [
        ...new Set(data.data.map((doc) => doc.speciality)),
      ];
      setSpecialities(uniqueSpecialities);
    } catch (err) {
      toast.error("Failed to load specialities");
    }
  };

  // Fetch doctors by speciality
  const fetchDoctors = async (sp) => {
    try {
      const { data } = await axios.get(
        sp ? `${URI}/api/doctor/filter?speciality=${sp}` : `${URI}/api/doctor`
      );
      if (data.success) {
        setDoctors(data.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch doctors");
    }
  };

  useEffect(() => {
    fetchAllSpecialities();
    fetchDoctors(activeSpeciality);
  }, []); // Run once on mount

  useEffect(() => {
    if (activeSpeciality !== speciality) {
      fetchDoctors(activeSpeciality);
    }
  }, [activeSpeciality]);

  const handleSpecialityClick = (sp) => {
    if (activeSpeciality === sp) {
      setActiveSpeciality("");
      navigate("/doctors");
    } else {
      setActiveSpeciality(sp);
      navigate(`/doctors/${sp}`);
    }
  };

  return (
    <div className="px-4 md:px-8 py-6">
      <p className="text-gray-600 text-base">
        Browse through the doctor specialists.
      </p>

      <div className="mt-6">
        {/* Filter button on small screens */}
        <button
          className={`py-2 px-4 border rounded text-sm sm:hidden ${
            showFilter ? "bg-primary text-white" : ""
          }`}
          onClick={() => setShowFilter(!showFilter)}
        >
          Filters
        </button>

        <div className="flex flex-col sm:flex-row gap-6 mt-6">
          {/* Sidebar */}
          <div
            className={`w-full sm:w-52 ${
              showFilter ? "block" : "hidden sm:block"
            } flex-shrink-0`}
          >
            <ul className="flex flex-wrap sm:flex-col gap-3 sm:gap-4 text-sm text-gray-700">
              {specialities.map((sp) => (
                <li
                  key={sp}
                  onClick={() => handleSpecialityClick(sp)}
                  className={`w-full px-4 py-2 border rounded-lg cursor-pointer transition-all hover:bg-indigo-100 ${
                    activeSpeciality === sp
                      ? "bg-indigo-100 text-black font-semibold"
                      : ""
                  }`}
                >
                  {sp}
                </li>
              ))}
            </ul>
          </div>

          {/* Doctors Grid */}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center">
            {doctors.length === 0 ? (
              <p className="text-center col-span-full text-gray-500">
                No doctors found.
              </p>
            ) : (
              doctors.map((doctor) => (
                <Link
                  to={`/appointment/${doctor._id}`}
                  key={doctor._id}
                  className="doctor-card border border-blue-200 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-1 transition-transform duration-300 bg-white w-full"
                >
                  <div className="h-48 bg-blue-50 overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src={doctor.image}
                      alt={doctor.name}
                    />
                  </div>
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
                    <p className="text-gray-600 text-sm">
                      {doctor.speciality}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
