import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { signupUser } from "../api";
import SocialAuthButtons from "../components/common/SocialAuthButtons";
import AuthInfoSection from "../components/common/AuthInfoSection";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const signupMutation = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      alert("Signup successful! Please login.");
      navigate("/login");
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Signup failed. Please try again.");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    signupMutation.mutate(formData);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Left Section - Signup Form */}
      <div className="w-full md:w-3/5 lg:w-3/5 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          <h1 className="text-4xl font-extrabold text-center text-emerald-500 dark:text-emerald-300 drop-shadow-sm tracking-wide">
            FilterXcel
          </h1>
          <p className="text-md text-center text-gray-600 dark:text-gray-200 mt-2 mb-6 font-bold">
            Create an account to get started!
          </p>

          {error && (
            <div className="bg-red-100 text-red-600 border border-red-400 p-3 rounded-md text-sm mb-4" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field with Icon */}
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 pl-10 border bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Email Field with Icon */}
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 pl-10 border bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Password Field with Icon */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 pl-10 border bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={signupMutation.isPending}
              className={`w-full p-3 font-semibold text-white rounded-lg transition focus:outline-none ${
                signupMutation.isPending
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              {signupMutation.isPending ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <SocialAuthButtons />

          <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      <AuthInfoSection />
    </div>
  );
};

export default Signup;
