import React, { useState } from "react";
import { useAuth } from "../../AuthContext";
import { updateUser } from "../../api";
import {
  FiLogOut,
  FiUser,
  FiMail,
  FiActivity,
  FiSettings,
  FiCheck,
  FiX,
} from "react-icons/fi";

const ProfileHeader = () => {
  const { profile, isProfileLoading, logout, fetchProfile } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newName, setNewName] = useState(profile?.name || "");
  const [newEmail, setNewEmail] = useState(profile?.email || "");
  const [isUpdating, setIsUpdating] = useState(false);

  if (isProfileLoading) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 space-y-4 animate-pulse">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Personal Information
        </h2>
        <div className="space-y-2">
          <div className="h-5 bg-gray-300 rounded w-1/2"></div>
          <div className="h-5 bg-gray-300 rounded w-1/3"></div>
          <div className="h-5 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const handleNameUpdate = async () => {
    try {
      setIsUpdating(true);
      await updateUser({ name: newName });
      await fetchProfile();
      setIsEditingName(false);
    } catch (error) {
      console.error("Failed to update name:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEmailUpdate = async () => {
    try {
      setIsUpdating(true);
      await updateUser({ email: newEmail });
      await fetchProfile();
      setIsEditingEmail(false);
    } catch (error) {
      console.error("Failed to update email:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 mt-3 flex items-center gap-3">
        My account
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transition duration-300 p-6 md:col-span-2 border-2 border-indigo-500 dark:border-indigo-400">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center gap-3">
              <FiUser size={24} /> Personal Information
            </h2>
            <button
              onClick={() => setIsEditingName(true)}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Edit
            </button>
          </div>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 text-base">
            <p className="flex items-center gap-2">
              <strong>Name:</strong>
              {isEditingName ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border rounded px-2 py-1 text-sm w-40 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                  />
                  <button
                    onClick={handleNameUpdate}
                    disabled={isUpdating}
                    className="text-green-600 hover:text-green-700"
                  >
                    <FiCheck size={18} />
                  </button>
                  <button
                    onClick={() => setIsEditingName(false)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              ) : (
                <>{profile?.name || "Not provided"}</>
              )}
            </p>
            <p>
              <strong>Joined:</strong>{" "}
              {profile?.createdAt
                ? new Date(profile.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Not available"}
            </p>
            <p>
              <strong>Country/Region:</strong>{" "}
              {profile?.country || "Not specified"}
            </p>
          </div>
        </div>

        {/* Row 2 Cards */}
        <div className="md:grid md:grid-cols-3 gap-8 md:col-span-2">
          {/* Recent Activity Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-4 space-y-6 border border-gray-100 dark:border-gray-700 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-3">
                <FiActivity size={22} /> Recent Activity
              </h3>
            </div>
            <ul className="space-y-4 text-gray-600 dark:text-gray-400 text-sm">
              <li>Logged in at {new Date().toLocaleTimeString()}</li>
              <li>Updated profile information</li>
              <li>Changed password</li>
            </ul>
          </div>

          {/* Email Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-4 space-y-6 border border-gray-100 dark:border-gray-700 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-600 dark:text-gray-200 flex items-center gap-3">
                <FiMail size={22} /> Email Info
              </h2>
              <button
                onClick={() => setIsEditingEmail(true)}
                className="text-indigo-600 hover:text-indigo-700"
              >
                Edit
              </button>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p className="flex items-center gap-2">
                <strong>Email:</strong>
                {isEditingEmail ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="border rounded px-2 py-1 text-sm w-56 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    />
                    <button
                      onClick={handleEmailUpdate}
                      disabled={isUpdating}
                      className="text-green-600 hover:text-green-700"
                    >
                      <FiCheck size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setIsEditingEmail(false);
                        setNewEmail(profile?.email || "");
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                ) : (
                  <>{profile?.email || "Not provided"}</>
                )}
              </p>
            </div>
          </div>

          {/* Account Actions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 p-4 space-y-6 border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-3 mb-6">
                <FiSettings size={22} /> Account Actions
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Manage your account actions from here.
              </p>
            </div>
            <button
              onClick={logout}
              className="mt-6 flex items-center gap-3 text-red-600 hover:text-red-700 font-semibold transition text-sm cursor-pointer"
            >
              <FiLogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
