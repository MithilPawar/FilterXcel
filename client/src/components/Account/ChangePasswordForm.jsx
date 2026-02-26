import React, { useState } from "react";
import { Eye, EyeOff, Shield, Lock } from "lucide-react";

const ChangePasswordForm = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setLoading(false);
      alert("✅ Password changed successfully!");
      setShowPasswordForm(false);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 gap-6">
  
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Change Password Card */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Lock className="text-indigo-600" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Change Password
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Keep your account secure by updating your password regularly.
          </p>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition w-fit"
          >
            {showPasswordForm ? "Close Form" : "Change Password"}
          </button>
        </div>
  
        {/* 2FA Card */}
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Shield className="text-green-600" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              Two-Factor Authentication (2FA)
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Add an extra layer of security to your account by enabling two-factor authentication.
          </p>
          <button
            className="bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition w-fit"
          >
            Manage 2FA
          </button>
        </div>
      </div>
  
      {/* Change Password Form Section */}
      {showPasswordForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 grid grid-cols-1 gap-4 border-t border-gray-300 dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Change Password</h3>
  
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-100"
                required
              />
              <button
                type="button"
                onClick={() => togglePassword("current")}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
  
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-100"
                required
              />
              <button
                type="button"
                onClick={() => togglePassword("new")}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
  
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type={showPassword.confirm ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-gray-100"
                required
              />
              <button
                type="button"
                onClick={() => togglePassword("confirm")}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
  
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
  
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2 justify-center"
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
            )}
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>
      )}
    </div>
  );  
};

export default ChangePasswordForm;
