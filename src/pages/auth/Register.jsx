import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginPageImage } from "../../config";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaUser, FaLock, FaEnvelope, FaPhone } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { registerUser } from "../../context/userSlice";
import toast from "react-hot-toast";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !formData.username ||
      !formData.name ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      const payload = {
        username: formData.username,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      };

      const res = await dispatch(registerUser(payload)).unwrap();
      if (res.success) {
        toast.success("Registration successful! Please login.");
        navigate("/login");
      } else {
        toast.error(res.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error registering:", error);
      toast.error(error || "Failed to register");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white/10 backdrop-blur-xl w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/20">
        {/* Left Side Image */}
        <div className="hidden md:flex flex-1">
          <img
            className="h-full w-full object-cover"
            src={LoginPageImage}
            alt="Register Illustration"
          />
        </div>

        {/* Right Side Form */}
        <div className="flex flex-col justify-between flex-1 px-6 py-6 text-white h-full overflow-y-auto md:overflow-y-hidden">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-3xl font-extrabold">Create Your Account ✨</h1>
            <p className="text-white/80 text-sm mt-1">
              Sign up to get started with your dashboard
            </p>
          </div>

          {/* Social Login */}
          <div className="flex flex-col space-y-2">
            <button className="flex items-center justify-center gap-3 border border-white/30 py-2 px-4 rounded-xl hover:bg-white/20 transition-all duration-300 text-sm font-medium backdrop-blur-lg">
              <FcGoogle size={20} /> Sign up with Google
            </button>
            <button className="flex items-center justify-center gap-3 bg-gray-900 text-white py-2 px-4 rounded-xl hover:bg-gray-800 transition-all duration-300 text-sm font-medium">
              <FaGithub size={20} /> Sign up with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-3">
            <div className="h-px bg-white/30 flex-1"></div>
            <span className="text-sm text-white/60">or</span>
            <div className="h-px bg-white/30 flex-1"></div>
          </div>

          {/* Register Form with 2-inline inputs */}
          <form className="space-y-3" onSubmit={handleRegister}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="relative">
                <FaUser className="absolute top-3 left-3 text-white/60" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all"
                  placeholder="Username"
                  required
                />
              </div>

              <div className="relative">
                <FaUser className="absolute top-3 left-3 text-white/60" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all"
                  placeholder="Full Name"
                  required
                />
              </div>

              <div className="relative">
                <FaEnvelope className="absolute top-3 left-3 text-white/60" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all"
                  placeholder="Email"
                  required
                />
              </div>

              <div className="relative">
                <FaPhone className="absolute top-3 left-3 text-white/60" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all"
                  placeholder="Phone"
                />
              </div>

              <div className="relative md:col-span-2">
                <FaLock className="absolute top-3 left-3 text-white/60" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all"
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-2.5 rounded-xl font-medium text-white shadow-lg hover:opacity-90 transition-all duration-300"
            >
              Register
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-sm text-white/70 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-pink-300 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
