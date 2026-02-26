import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../AuthContext";
import SocialAuthButtons from "../components/common/SocialAuthButtons";
import AuthInfoSection from "../components/common/AuthInfoSection";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      await login(formData);
      setFormData({ email: "", password: "" });
      navigate("/home");
    } catch (error) {
      setError(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Left Section - Login Form */}
      <div className="w-full md:w-3/5 lg:w-3/5 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          <h1 className="text-4xl font-extrabold text-center text-emerald-500 dark:text-emerald-300 drop-shadow-sm tracking-wide">
            FilterXcel
          </h1>
          <p className="text-md text-center text-gray-600 dark:text-gray-200 mt-2 mb-6 font-bold">
            Access your workspace with a secure login
          </p>

          {error && (
            <div
              className="bg-red-100 text-red-600 border border-red-400 p-3 rounded-md text-sm mb-4"
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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

            {/* Password Field with Icon and Toggle */}
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 pl-10 pr-10 border bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>

            <div className="flex justify-between text-sm">
              <Link
                to="/forgot-password"
                className="text-emerald-500 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full p-3 font-semibold text-white rounded-lg transition focus:outline-none ${
                loading
                  ? "bg-emerald-400 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <SocialAuthButtons />

          <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-emerald-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <AuthInfoSection />
    </div>
  );
};

export default Login;
