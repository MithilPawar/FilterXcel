import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { themeToggle } from "../../redux/slices/themeSlice"; 

const AccountSettings = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state) => state.theme.theme);

  const [language, setLanguage] = useState("en");
  const [region, setRegion] = useState("IN");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timeFormat, setTimeFormat] = useState("24h");

  const [editingLanguage, setEditingLanguage] = useState(false);
  const [editingDateTime, setEditingDateTime] = useState(false);
  const [editingTheme, setEditingTheme] = useState(false);

  const handleDeactivate = () => {
    if (window.confirm("Are you sure you want to deactivate your account?")) {
      alert("Account deactivated.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <h2 className="text-4xl font-bold mb-8 text-gray-800">Account Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Language & Region */}
        <div className="p-6 bg-white rounded-2xl shadow space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-gray-800">Language & Region</h3>
            <button
              onClick={() => setEditingLanguage(!editingLanguage)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {editingLanguage ? "Save" : "Change"}
            </button>
          </div>
          {!editingLanguage ? (
            <div className="space-y-4">
              <p className="text-gray-600">
                Language: {language === "en" ? "English" : language === "hi" ? "Hindi" : "Marathi"}
              </p>
              <p className="text-gray-600">
                Region: {region === "IN" ? "India" : region === "US" ? "United States" : "United Kingdom"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium text-gray-600">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="mr">Marathi</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-600">Region</label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="IN">India</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Date & Time Format */}
        <div className="p-6 bg-white rounded-2xl shadow space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-gray-800">Date & Time Format</h3>
            <button
              onClick={() => setEditingDateTime(!editingDateTime)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {editingDateTime ? "Save" : "Change"}
            </button>
          </div>
          {!editingDateTime ? (
            <div className="space-y-4">
              <p className="text-gray-600">Date Format: {dateFormat}</p>
              <p className="text-gray-600">Time Format: {timeFormat === "12h" ? "12-Hour" : "24-Hour"}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium text-gray-600">Date Format</label>
                <div className="flex gap-6">
                  {["DD/MM/YYYY", "MM/DD/YYYY"].map((format) => (
                    <label key={format} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        value={format}
                        checked={dateFormat === format}
                        onChange={(e) => setDateFormat(e.target.value)}
                        className="accent-blue-600"
                      />
                      <span>{format}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-600">Time Format</label>
                <div className="flex gap-6">
                  {["12h", "24h"].map((format) => (
                    <label key={format} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        value={format}
                        checked={timeFormat === format}
                        onChange={(e) => setTimeFormat(e.target.value)}
                        className="accent-blue-600"
                      />
                      <span>{format === "12h" ? "12-Hour" : "24-Hour"}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme Preference */}
        <div className="p-6 bg-white rounded-2xl shadow space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-semibold text-gray-800">Theme Preference</h3>
            <button
              onClick={() => setEditingTheme(!editingTheme)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {editingTheme ? "Save" : "Change"}
            </button>
          </div>
          {!editingTheme ? (
            <div className="space-y-4">
              <p className="text-gray-600">Theme: {currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}</p>
            </div>
          ) : (
            <div className="flex gap-6">
              {["light", "dark"].map((value) => (
                <label key={value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value={value}
                    checked={currentTheme === value}
                    onChange={() => dispatch(themeToggle())}
                    className="accent-blue-600"
                  />
                  <span className="capitalize">{value}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Account Deactivation */}
        <div className="p-6 bg-red-50 rounded-2xl border border-red-200 space-y-6 col-span-1 lg:col-span-2">
          <p className="text-md text-red-600">
            Deactivating your account will permanently disable your access. Ensure you have backed up all important data before proceeding.
          </p>
          <button
            onClick={handleDeactivate}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
          >
            Deactivate / Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
