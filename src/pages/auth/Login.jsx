import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_BASE_URL, LoginPageImage } from "../../config";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  async function handleLogin(e) {
    e.preventDefault();
    // Handle login logic here
    const user = { username, password };
    let data = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    let res = await data.json();
    console.log("User logged in:", res);
    if (res.success) {
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("token", res.token);
      if (res.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } else {
      alert(res.message || "Login failed");
    }
  }
  return (
    <div className="bg-[#ffe6c9] min-h-screen flex items-center justify-center p-3">
      <div className="bg-white max-w-4xl w-full rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* Left Side Image */}
        <div className="hidden md:flex flex-1">
          <img
            className="h-full w-full object-cover"
            src={LoginPageImage}
            alt="Login Illustration"
          />
        </div>

        {/* Right Side Form */}
        <div className="flex flex-col justify-center flex-1 px-6 md:px-8 py-6 space-y-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Login to Your Account
          </h1>
          <p className="text-gray-600 text-sm">
            See what's going on in your business
          </p>

          {/* Social Login */}
          <div className="flex flex-col space-y-2">
            <button className="flex items-center justify-center gap-2 border border-gray-300 py-2 px-3 rounded-md hover:bg-gray-100 transition text-sm">
              <FcGoogle size={20} /> Login with Google
            </button>
            <button className="flex items-center justify-center gap-2 bg-[#333] text-white py-2 px-3 rounded-md hover:bg-black transition text-sm">
              <FaGithub size={20} /> Login with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="text-xs text-gray-500">or</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          {/* Email & Password Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-[#631e4d] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-[#631e4d] focus:outline-none"
              />
            </div>

            <div className="flex justify-end">
              <a href="#" className="text-xs text-[#631e4d] hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#631e4d] text-white py-2.5 rounded-md hover:bg-[#631e4de6] transition text-sm"
            >
              Login
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-xs text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-[#631e4d] font-medium hover:underline"
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
