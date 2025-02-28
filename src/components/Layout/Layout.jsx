import React, { useState } from "react";
import { Outlet } from "react-router-dom"; // Import Outlet
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navbar */}
      <Navbar />

      {/* Main Content with Sidebar (Adding margin to avoid overlap with Navbar) */}
      <div className="flex flex-1 mt-16">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          toggle={toggleSidebar}
        />
        {/* Main Content */}
        <Outlet /> {/* This will render Home and other child routes */}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Layout;
