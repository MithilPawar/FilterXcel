import React, { useState } from "react";
import ProfileSidebar from "../components/Account/ProfileSidebar";
import ProfileHeader from "../components/Account/ProfileHeader";
import ChangePasswordForm from "../components/Account/ChangePasswordForm";
import AccountSettings from "../components/Account/AccountSettings";
import RecentTask from "../components/Account/RecentTask";
import TeamPage from "../components/Account/TeamPage";

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState("account");

  const renderSection = () => {
    switch (activeSection) {
      case "account":
        return <ProfileHeader />;
      case "security":
        return <ChangePasswordForm />;
      case "team":
        return <TeamPage />;
      case "last-task":
        return <RecentTask />;
      case "settings":
        return <AccountSettings />;
      default:
        return <ProfileHeader />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <ProfileSidebar
        setActiveSection={setActiveSection}
        activeSection={activeSection}
      />
      <div className="flex-1 overflow-auto p-6 mt-4 flex flex-col w-full">
        <div className="w-full">{renderSection()}</div>
      </div>
    </div>
  );
};

export default ProfilePage;
