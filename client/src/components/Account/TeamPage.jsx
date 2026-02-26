import React from "react";

const TeamPage = () => {
  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 mt-3">
        Team Collaboration (Future Feature)
      </h1>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
        Collaborate with your team
      </h2>
      
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        With Team Collaboration, you can easily work together with your team on
        tasks, share updates, and manage projects. Invite your team members and
        get started with seamless collaboration.
      </p>

      {/* Invite Member Button */}
      <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300">
        Invite Member
      </button>
    </div>
  );
};

export default TeamPage;
