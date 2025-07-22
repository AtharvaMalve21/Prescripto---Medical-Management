import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const Appointment = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [similarDoctors, setSimilarDoctors] = useState([]);
  const URI = import.meta.env.VITE_BACKEND_URI;

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // Fetch doctor by ID
        const { data: doctorRes } = await axios.get(`${URI}/api/doctor/${id}`);
        if (doctorRes.success) {
          const fetchedDoctor = doctorRes.data;
          setDoctor(fetchedDoctor);

          // Fetch doctors by same speciality
          const { data: similarRes } = await axios.get(
            `${URI}/api/doctor/filter?speciality=${fetchedDoctor.speciality}`
          );

          if (similarRes.success) {
            // Filter out current doctor from similar list
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
    <div className="p-4">
      {doctor && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{doctor.name}</h2>
          <p className="text-gray-600">{doctor.speciality}</p>
        </div>
      )}

      <div>
        <h3 className="text-2xl">Similar Doctors</h3>
        <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
          {similarDoctors.map((doctor) => (
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
                <p className="text-gray-900 text-lg font-medium">
                  {doctor.name}
                </p>
                <p className="text-gray-600 text-sm">{doctor.speciality}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointment;
