import React, { useContext } from "react";
import { DoctorContext } from "../context/DoctorContext";
import { Link, useNavigate } from "react-router-dom";

const TopDoctors = () => {
  const { doctors } = useContext(DoctorContext);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-4 my-16 to-gray-900 md:mx-10">
      <h1 className="text-3xl font-medium">Top Doctors to Book</h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {doctors.slice(0, 10).map((doctor) => (
          <Link
            to={`/appointment/${doctor._id}`}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            key={doctor._id}
          >
            <img className="bg-blue-50" src={doctor.image} />
            <div className="p-4">
              {doctor.available && (
                <div className="flex items-center gap-2 text-sm text-center text-green-500">
                  <p className="w-2 h-2 bg-green-500 rounded-full"></p>{" "}
                  <p>Available</p>
                </div>
              )}
              <p className="text-gray-900 text-lg font-medium">{doctor.name}</p>
              <p className="text-gray-600 text-sm">{doctor.speciality}</p>
            </div>
          </Link>
        ))}
      </div>
      <button
        className="mt-10 px-8 py-3 rounded-full bg-primary/10 text-primary font-semibold shadow-sm hover:bg-primary/20 hover:text-primary-dark transition duration-200"
        onClick={() => navigate("/doctors")}
      >
        View More
      </button>
    </div>
  );
};

export default TopDoctors;
