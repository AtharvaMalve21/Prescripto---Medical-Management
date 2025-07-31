import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { DoctorContext } from "../../context/DoctorContext.jsx";

const DoctorProfile = () => {
  const { doctor, setDoctor } = useContext(DoctorContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: doctor?.name || "",
    email: doctor?.email || "",
    about: doctor?.about || "",
    address: doctor?.address || "",
    fees: doctor?.fees || "",
    available: doctor?.available || true,
  });

  const URI = import.meta.env.VITE_BACKEND_URI;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put(`${URI}/api/doctor/profile`, formData, {
        withCredentials: true,
      });

      if (data.success) {
        setDoctor({ ...doctor, ...formData });
        setIsEditing(false);
        toast.success("Profile updated successfully");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getBookedSlotsCount = () => {
    if (!doctor?.slots_booked) return 0;
    return Object.values(doctor.slots_booked).reduce(
      (total, slots) => total + slots.length,
      0
    );
  };

  if (!doctor) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
            <div className="flex items-center space-x-6 mb-8">
              <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
              <div className="space-y-4 flex-1">
                <div className="h-8 bg-gray-200 rounded w-64"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Doctor Profile
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your professional information and settings
          </p>
        </div>
        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: doctor?.name || "",
                    email: doctor?.email || "",
                    about: doctor?.about || "",
                    address: doctor?.address || "",
                    fees: doctor?.fees || "",
                    available: doctor?.available || true,
                  });
                }}
                className="px-6 py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 md:px-8 py-10 md:py-14 rounded-2xl shadow-md">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
            {/* Profile Image & Badge */}
            <div className="relative">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-100 rounded-full shadow-sm">
                <svg
                  className="w-3.5 h-3.5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Verified
              </span>
            </div>

            {/* Info Section */}
            <div className="text-white text-center lg:text-left flex-1">
              {!isEditing ? (
                <>
                  <h2 className="text-3xl font-bold mb-2">{doctor.name}</h2>
                  <p className="text-indigo-100 text-lg font-medium mb-4">
                    {doctor.speciality}
                  </p>

                  <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-sm">
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {doctor.experience}
                    </div>

                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {doctor.degree}
                    </div>

                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      ₹{doctor.fees}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-4 max-w-md mx-auto lg:mx-0">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
                    placeholder="Doctor Name"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/40"
                    placeholder="Email"
                  />
                </div>
              )}
            </div>

            {/* Status Toggle */}
            <div className="flex flex-col items-center gap-4">
              <div
                className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
                  doctor.available
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {doctor.available ? "Available" : "Unavailable"}
              </div>

              {isEditing && (
                <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleInputChange}
                    className="w-4 h-4 bg-white/20 border-white/30 rounded focus:ring-white/50"
                  />
                  <span>Available</span>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="p-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  About
                </h3>
                {!isEditing ? (
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                    {doctor.about}
                  </p>
                ) : (
                  <textarea
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Tell patients about yourself..."
                  />
                )}
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <svg
                      className="w-5 h-5 text-gray-500 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">{doctor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <svg
                      className="w-5 h-5 text-gray-500 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Address</p>
                      {!isEditing ? (
                        <p className="text-gray-600 whitespace-pre-line">
                          {doctor.address}
                        </p>
                      ) : (
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          placeholder="Enter address..."
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Consultation Fee</span>
                    <div className="flex items-center gap-2">
                      {!isEditing ? (
                        <span className="font-bold text-green-600">
                          ₹{doctor.fees}
                        </span>
                      ) : (
                        <input
                          type="number"
                          name="fees"
                          value={formData.fees}
                          onChange={handleInputChange}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Booked Slots</span>
                    <span className="font-bold text-blue-600">
                      {getBookedSlotsCount()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(doctor.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Professional Info */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Professional Info
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {doctor.degree}
                      </p>
                      <p className="text-sm text-gray-500">Degree</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {doctor.experience}
                      </p>
                      <p className="text-sm text-gray-500">Experience</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-purple-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM4 14a1 1 0 100 2h4a1 1 0 100-2H4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {doctor.speciality}
                      </p>
                      <p className="text-sm text-gray-500">Speciality</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
