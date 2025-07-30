import React, { useContext, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const { setAdmin, setIsAdminLoggedIn } = useContext(AdminContext);
  const { setDoctor, setIsDoctorLoggedIn } = useContext(DoctorContext);
  const navigate = useNavigate();

  const URI = import.meta.env.VITE_BACKEND_URI;

  const toggleRole = () => {
    setState((prev) => (prev === "Admin" ? "Doctor" : "Admin"));
  };

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const sumbitHandler = async (ev) => {
    ev.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        URI +
          `${
            state === "Admin" ? "/api/admin/login" : "/api/auth/login-doctor"
          }`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      //admin is logged in
      if (data.success && state === "Admin") {
        setAdmin(data.data);
        setIsAdminLoggedIn(true);
        toast.success(data.message);
        navigate("/admin");
      }

      //doctor is logged in
      if (data.success && state === "Doctor") {
        setDoctor(data.data);
        setIsDoctorLoggedIn(true);
        toast.success(data.message);
        navigate("doctor");
      }
    } catch (err) {
      console.log(err.message);
      toast.error(err.response?.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <form
          onSubmit={sumbitHandler}
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8FAFC] to-[#E2E8F0] px-4"
        >
          <div className="flex flex-col gap-5 p-8 w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg">
            <p className="text-3xl font-bold text-center text-gray-800">
              <span className="text-primary">{state}</span> Login
            </p>

            <div className="w-full">
              <label htmlFor="email" className="block text-gray-600 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <div className="w-full relative">
              <label htmlFor="password" className="block text-gray-600 mb-1">
                Password
              </label>
              <input
                id="password"
                value={password}
                onChange={(ev) => setPassword(ev.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-4 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <span
                onClick={togglePassword}
                className="absolute right-3 top-[38px] text-gray-500 cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-primary hover:bg-primary/90 text-white font-semibold rounded-md transition-all duration-200"
            >
              Login
            </button>

            <p className="text-center text-sm text-gray-600">
              {state === "Admin" ? (
                <>
                  Doctor Login?{" "}
                  <button
                    type="button"
                    onClick={toggleRole}
                    className="text-primary hover:underline font-medium"
                  >
                    Click here
                  </button>
                </>
              ) : (
                <>
                  Admin Login?{" "}
                  <button
                    type="button"
                    onClick={toggleRole}
                    className="text-primary hover:underline font-medium"
                  >
                    Click here
                  </button>
                </>
              )}
            </p>
          </div>
        </form>
      )}
    </>
  );
};

export default Login;
