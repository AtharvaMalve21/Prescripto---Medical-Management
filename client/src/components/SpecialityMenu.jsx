import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../context/DoctorContext";
import { specialityData } from "../assets/assets_frontend/assets";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  const { doctors } = useContext(DoctorContext);
  const [uniqueSpecialities, setUniqueSpecialities] = useState([]);
  const URI = import.meta.env.VITE_BACKEND_URI;

  useEffect(() => {
    const specialitiesSet = new Set(doctors.map((doc) => doc.speciality));
    const mapped = Array.from(specialitiesSet).map((speciality) => {
      const match = specialityData.find(
        (item) => item.speciality.toLowerCase() === speciality.toLowerCase()
      );
      return {
        speciality,
        image: match ? match.image : "https://via.placeholder.com/100",
      };
    });
    setUniqueSpecialities(mapped);
  }, [doctors]);

  return (
    <div
      className="flex flex-col items-center gap-4 py-16 text-gray-800"
      id="speciality"
    >
      <h1 className="text-3xl font-medium">Find by Speciality</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors, schedule
        your appointment hassle-free.
      </p>

      {/* Scrollable Speciality Cards */}
      <div className="w-full flex items-center justify-center">
        <div
          className="flex gap-6 pt-5 px-4 w-full max-w-3xl overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory"
          style={{
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {uniqueSpecialities.map(({ speciality, image }, index) => (
            <Link
              key={index}
              to={`/doctors/${speciality}`}
              className="flex flex-col items-center text-xs cursor-pointer flex-shrink-0 snap-start transition-all duration-500 hover:-translate-y-2"
            >
              <img src={image} alt={speciality} className="w-16 sm:w-24 mb-2" />
              <p>{speciality}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialityMenu;
