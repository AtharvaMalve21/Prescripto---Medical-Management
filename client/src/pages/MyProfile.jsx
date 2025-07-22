import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext.jsx";
import { FaCamera } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader.jsx";

const MyProfile = () => {
  const { user, setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    gender: "",
    phone: "",
    address: "",
    dob: "",
    image: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);

  const URI = import.meta.env.VITE_BACKEND_URI;
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUserData({
        name: user?.name || "",
        email: user?.email || "",
        gender: user?.additionalDetails?.gender || "",
        phone: user?.additionalDetails?.phone || "",
        address: user?.additionalDetails?.address || "",
        dob: user?.additionalDetails?.dob || "",
        image: user?.additionalDetails?.image || "",
      });
    }
  }, [user]);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(file);
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await axios.put(
        URI + "/api/profile/update-profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // since you're using cookies
        }
      );

      if (response.data.success) {
        // Refetch updated user data
        const { data } = await axios.get(URI + "/api/profile/patient-profile", {
          withCredentials: true,
        });

        setUser(data.data); // Update context
        setIsEdit(false);
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.log(error.response.data.message);
      console.log(error.message);
      toast.error(error.response.data.message);
      console.error("Failed to update profile", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6 space-y-6">
      {loading && <Loader />}
      <div className="flex flex-col items-center space-y-2">
        <div className="relative">
          {selectedImage || userData.image ? (
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : userData.image
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border"
            />
          ) : (
            <div className="w-32 h-32 rounded-full border flex items-center justify-center bg-primary text-white text-4xl font-semibold uppercase">
              {userData.name?.charAt(0) || "U"}
            </div>
          )}

          {isEdit && (
            <label className="absolute bottom-0 right-0 bg-gray-200 p-2 rounded-full cursor-pointer">
              <FaCamera />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>
        {isEdit ? (
          <input
            type="text"
            name="name"
            value={userData.name}
            onChange={changeHandler}
            className="text-xl font-semibold text-center border-b focus:outline-none"
          />
        ) : (
          <h2 className="text-xl font-semibold">{userData.name}</h2>
        )}
      </div>

      <hr />

      <div>
        <h3 className="text-lg font-medium mb-2">Contact Information</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label>Email:</label>
            {isEdit ? (
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={changeHandler}
                className="w-full border rounded px-2 py-1"
              />
            ) : (
              <p>{userData.email}</p>
            )}
          </div>
          <div>
            <label>Phone:</label>
            {isEdit ? (
              <input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={changeHandler}
                className="w-full border rounded px-2 py-1"
              />
            ) : (
              <p>{userData.phone}</p>
            )}
          </div>
          <div>
            <label>Address:</label>
            {isEdit ? (
              <textarea
                name="address"
                value={userData.address}
                onChange={changeHandler}
                rows={3}
                className="w-full border rounded px-2 py-1"
              />
            ) : (
              <p>{userData.address}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Basic Information</h3>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label>Gender:</label>
            {isEdit ? (
              <select
                name="gender"
                value={userData.gender}
                onChange={changeHandler}
                className="w-full border rounded px-2 py-1"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p>{userData.gender}</p>
            )}
          </div>
          <div>
            <label>Date of Birth:</label>
            {isEdit ? (
              <input
                type="date"
                name="dob"
                value={userData.dob}
                onChange={changeHandler}
                className="w-full border rounded px-2 py-1"
              />
            ) : (
              <p>{userData.dob}</p>
            )}
          </div>
        </div>
      </div>

      <div className="text-center">
        {isEdit ? (
          <button
            onClick={updateProfile}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Information
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            {loading ? "Editing" : "Edit Profile"}
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
