import React from "react";
import avatarImg from "../../assets/avater.png";
import { useAuth } from "../../AuthContext";
import { User, Shield, Users, CheckSquare, Settings } from "lucide-react";

const ProfileSidebar = ({ activeSection, setActiveSection }) => {
  const { profile, isProfileLoading } = useAuth();

  const navItems = [
    { id: "account", label: "My Account", icon: <User size={18} /> },
    { id: "security", label: "Security", icon: <Shield size={18} /> },
    { id: "team", label: "Team", icon: <Users size={18} /> },
  ];

  const otherItems = [
    { id: "last-task", label: "Last Task", icon: <CheckSquare size={18} /> },
    { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  const renderItem = (item) => (
    <li key={item.id}>
      <button
        onClick={() => setActiveSection(item.id)}
        className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg font-medium transition-all
        ${
          activeSection === item.id
            ? "bg-indigo-600 text-white shadow"
            : "text-indigo-600 hover:bg-indigo-100"
        }`}
      >
        {item.icon}
        {item.label}
      </button>
    </li>
  );

  if (isProfileLoading) {
    return (
      <div className="flex flex-col w-64 p-6 space-y-6">
        <div className="bg-indigo-50 text-indigo-900 rounded-2xl p-4 mb-6 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-indigo-300 animate-pulse"></div>
          <div>
            <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide">
              Welcome,
            </p>
            <p className="text-md font-bold">Loading...</p>
          </div>
        </div>
        <div className="bg-white text-gray-800 p-6 shadow-xl flex-1 rounded-xl">
          <div className="space-y-4 animate-pulse">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-5 bg-gray-200 rounded w-2/4"></div>
            <div className="h-5 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-64 p-6 space-y-6">
      {/* Greeting */}
      <div className="bg-indigo-50 text-indigo-900 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-600 shadow">
          <img
            src={avatarImg}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide">
            Welcome,
          </p>
          <p className="text-md font-bold">{profile?.name || "User"}!</p>
        </div>
      </div>

      {/* Sidebar Links */}
      <div className="bg-white text-gray-800 p-6 shadow-xl flex-1 rounded-xl flex flex-col">
        <div>
          <p className="text-sm text-gray-500 font-semibold uppercase mb-4 tracking-wider">Profile</p>
          <ul className="space-y-2">
            {navItems.map(renderItem)}
          </ul>

          <p className="text-sm text-gray-500 font-semibold uppercase mt-8 mb-4 tracking-wider">Other</p>
          <ul className="space-y-2">
            {otherItems.map(renderItem)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;