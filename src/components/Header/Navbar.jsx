import React from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../Button/ThemeToggle.jsx";
import { useSelector } from "react-redux";

const Navbar = () => {
  const theme = useSelector((state) => state.theme.theme);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navbarBgColor = theme === "dark" ? "bg-gray-800" : "bg-white";
  const textColor = theme === "dark" ? "text-emerald-300" : "text-emerald-600";

  return (
    <nav className={`${navbarBgColor} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side: FilterXcel */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className={`${textColor} text-3xl font-extrabold tracking-wide hover:text-emerald-300`}
            >
              FilterXcel
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`${
                isActive("/") ? "bg-gray-700 text-white" : "text-gray-300"
              } text-lg font-medium hover:bg-gray-700 hover:text-white px-4 py-2 rounded-lg transition ease-in-out duration-300`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`${
                isActive("/about") ? "bg-gray-700 text-white" : "text-gray-300"
              } text-lg font-medium hover:bg-gray-700 hover:text-white px-4 py-2 rounded-lg transition ease-in-out duration-300`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={`${
                isActive("/contact") ? "bg-gray-700 text-white" : "text-gray-300"
              } text-lg font-medium hover:bg-gray-700 hover:text-white px-4 py-2 rounded-lg transition ease-in-out duration-300`}
            >
              Contact
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};


export default Navbar;
