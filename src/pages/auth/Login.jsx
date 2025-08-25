import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginPageImage } from "../../config";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaUser, FaLock } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { loginUser } from "../../context/userSlice";
import toast from "react-hot-toast";
import socket from "../../utils/socket";
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.identifier || !formData.password) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      const payload = {
        identifier: formData.identifier,
        password: formData.password,
      };

      const res = await dispatch(loginUser(payload)).unwrap();
      if (res.success) {
        toast.success("Login successful!");
        socket.connect();
        socket.emit("registerUser", res.user._id);
        navigate("/");
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error(error || "Failed to login");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white/10 backdrop-blur-xl max-w-4xl w-full h-[90vh] rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-white/20">
        {/* Left Side Image */}
        <div className="hidden md:flex flex-1">
          <img
            className="h-full w-full object-cover"
            src={LoginPageImage}
            alt="Login Illustration"
          />
        </div>

        {/* Right Side Form */}
        <div className="flex flex-col justify-center flex-1 px-6 py-6 text-white space-y-5 overflow-y-auto">
          <h1 className="text-3xl font-extrabold">Welcome Back 👋</h1>
          <p className="text-white/80 text-sm">
            Login to continue exploring your dashboard
          </p>

          {/* Social Login */}
          <div className="flex flex-col space-y-2">
            <button className="flex items-center justify-center gap-3 border border-white/30 py-2 px-4 rounded-xl hover:bg-white/20 transition-all duration-300 text-sm font-medium backdrop-blur-lg">
              <FcGoogle size={20} /> Login with Google
            </button>
            <button className="flex items-center justify-center gap-3 bg-gray-900 text-white py-2 px-4 rounded-xl hover:bg-gray-800 transition-all duration-300 text-sm font-medium">
              <FaGithub size={20} /> Login with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px bg-white/30 flex-1"></div>
            <span className="text-sm text-white/60">or</span>
            <div className="h-px bg-white/30 flex-1"></div>
          </div>

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="relative">
              <FaUser className="absolute top-3 left-3 text-white/60" />
              <input
                type="text"
                id="identifier"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all"
                placeholder="Email or Username"
                required
              />
            </div>

            <div className="relative">
              <FaLock className="absolute top-3 left-3 text-white/60" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/20 text-white placeholder-white/60 border border-white/30 focus:ring-2 focus:ring-pink-400 focus:outline-none transition-all"
                placeholder="Password"
                required
              />
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-pink-300 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-2.5 rounded-xl font-medium text-white shadow-lg hover:opacity-90 transition-all duration-300"
            >
              Login
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-sm text-white/70">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-pink-300 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
