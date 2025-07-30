import React, { useState, useContext } from "react";
import { assets } from "../../assets/assets_admin/assets";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

const AddDoctor = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    experience: "1 years",
    fees: "",
    speciality: "General physician",
    degree: "",
    address: "",
    about: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Please upload a doctor image.");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("password", formData.password);
    data.append("experience", formData.experience);
    data.append("fees", formData.fees);
    data.append("speciality", formData.speciality);
    data.append("degree", formData.degree);
    data.append("address", formData.address);
    data.append("about", formData.about);
    data.append("image", image);

    try {
      setLoading(true);
      const res = await axios.post(`${URI}/api/admin/add-doctor`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Doctor added successfully!");
        setFormData({
          name: "",
          email: "",
          password: "",
          experience: "1 years",
          fees: "",
          speciality: "General physician",
          degree: "",
          address: "",
          about: "",
        });

        //fetch doctors details
        setImage(null);
        setPreview(null);
      }
    } catch (err) {
      console.log(err.message);
      toast.error(err.response?.data?.message || "Failed to add doctor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {loading && <Loader />}

      <form
        className="p-6 md:p-10 max-w-5xl mx-auto bg-white rounded-xl shadow-lg space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold text-primary mb-2">Add Doctor</h2>

        {/* Upload Section */}
        <div className="max-w-sm">
          <div className="flex flex-col items-center justify-center border border-dashed border-primary/50 p-6 rounded-xl bg-primary/5">
            <label htmlFor="doc-img" className="cursor-pointer">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="h-28 w-28 rounded-full object-cover shadow"
                />
              ) : (
                <img
                  src={assets.upload_area}
                  alt="upload"
                  className="h-24 object-contain"
                />
              )}
            </label>
            <input
              type="file"
              id="doc-img"
              hidden
              onChange={handleImageChange}
            />
            <p className="text-sm text-gray-600 mt-2 text-center">
              Upload doctor <br /> picture
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doctor Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Name"
                required
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doctor Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Email"
                required
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doctor Password
              </label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type="password"
                placeholder="Password"
                required
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience
              </label>
              <select
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={`${i + 1} years`}>
                    {i + 1} year{i > 0 ? "s" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fees
              </label>
              <input
                name="fees"
                value={formData.fees}
                onChange={handleChange}
                type="number"
                placeholder="Fees"
                required
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Speciality
              </label>
              <select
                name="speciality"
                value={formData.speciality}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="General physician">General physician</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Pediatricians">Pediatricians</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degree
              </label>
              <input
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                type="text"
                placeholder="Degree"
                required
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                type="text"
                placeholder="Address"
                required
                className="w-full border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                About Doctor
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={5}
                placeholder="Write about doctor..."
                className="w-full border rounded-md px-3 py-2 outline-none resize-none focus:ring-2 focus:ring-primary"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full md:w-auto bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-all"
          >
            Add Doctor
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
