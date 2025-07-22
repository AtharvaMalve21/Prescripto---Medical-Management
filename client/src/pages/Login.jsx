import React, { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { UserContext } from "../context/UserContext";
import { Link, useNavigate } from "react-router-dom";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import Loader from "../components/Loader.jsx";

const Login = () => {
  const { setUser, setIsLoggedIn } = useContext(UserContext);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (ev) => {
    const { name, value } = ev.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const URI = import.meta.env.VITE_BACKEND_URI;
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const loginAccount = async (ev) => {
    ev.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${URI}/api/auth/login-patient`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (data.success) {
        setUser(data.data);
        setIsLoggedIn(true);
        toast.success(data.message);
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      {loading && <Loader />}
      <div className="w-full max-w-md bg-white border p-8 rounded-3xl shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Login</h2>
        <p className="text-sm text-gray-600 mb-6">
          Please log in to book appointment
        </p>

        <form onSubmit={loginAccount} className="space-y-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
              <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                id="email"
                className="w-full border-none outline-none text-sm text-gray-700 placeholder-gray-400"
                value={formData.email}
                onChange={changeHandler}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-blue-500 transition">
              <LockClosedIcon className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                className="w-full border-none text-sm outline-none text-gray-700 placeholder-gray-400"
                value={formData.password}
                onChange={changeHandler}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="ml-2 focus:outline-none"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Click here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
