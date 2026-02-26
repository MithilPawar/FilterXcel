import React from "react";

const RecentTask = () => {
  const activities = [
    "Logged in",
    "Updated profile",
    "Changed password",
    "Enabled Two-Factor Authentication",
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 h-full">
      <h3 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
        Recent Activity
      </h3>
      <ul className="space-y-3">
        {activities.map((activity, index) => (
          <li key={index} className="text-gray-600 dark:text-gray-400">
            • {activity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTask;
