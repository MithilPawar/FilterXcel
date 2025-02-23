import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, Filter, BarChart2 } from "lucide-react";
import ThemeToggle from "../Button/ThemeToggle";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false); // State for dropdown
  const menuRef = useRef(null); // Ref for detecting click outside
  const theme = useSelector((state) => state.theme.theme);
  const location = useLocation();
  const file = useSelector((state) => state.file.file);
  const isLoading = useSelector((state) => state.file.loading);

  const isActive = (path) => location.pathname === path;

  const navbarBgColor =
    theme === "dark"
      ? "bg-gray-800 shadow-lg"
      : "bg-gray-100 border-b border-gray-300 shadow-gray-400/40 shadow-md";

  // Close menu if click is outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
        setDropdownOpen(false); // Close dropdown when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className={`${navbarBgColor} shadow-lg fixed top-0 left-0 w-full z-50 h-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Left Side: Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className={`text-emerald-400 text-3xl font-extrabold tracking-wide hover:text-emerald-300 ${
                theme === "dark" ? "text-emerald-300" : "text-emerald-600"
              }`}
            >
              FilterXcel
            </Link>
          </div>

          {/* Center: Navbar Links */}
          <div className="flex-1 flex justify-center space-x-6">
            <Link
              to="/"
              className={`${
                isActive("/")
                  ? theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 text-gray-900"
                  : theme === "dark"
                  ? "text-white"
                  : "text-gray-700"
              } text-lg font-medium hover:bg-gray-700 hover:text-white px-4 py-2 rounded-lg transition ease-in-out duration-300`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`${
                isActive("/about")
                  ? theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 text-gray-900"
                  : theme === "dark"
                  ? "text-white"
                  : "text-gray-700"
              } text-lg font-medium hover:bg-gray-700 hover:text-white px-4 py-2 rounded-lg transition ease-in-out duration-300`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={`${
                isActive("/contact")
                  ? theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-200 text-gray-900"
                  : theme === "dark"
                  ? "text-white"
                  : "text-gray-700"
              } text-lg font-medium hover:bg-gray-700 hover:text-white px-4 py-2 rounded-lg transition ease-in-out duration-300`}
            >
              Contact
            </Link>
          </div>

          <div className="p-2">
            <ThemeToggle />
          </div>

          {/* Right Side: Hamburger Menu (Mobile) */}
          {file && !isLoading && (
            <div className="flex items-center space-x-4">
              {/* Dropdown for Excel operations */}
              <div className="relative">
                {/* Hamburger icon for mobile */}
                <button
                  onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                  aria-expanded={isMobileMenuOpen ? "true" : "false"}
                  aria-controls="mobile-menu"
                  disabled={isLoading}
                  className={`${
                    isMobileMenuOpen
                      ? "bg-gray-700 text-white"
                      : theme === "dark"
                      ? "text-white"
                      : "text-black"
                  } text-lg font-medium hover:bg-gray-700 hover:text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition ease-in-out duration-300`}
                >
                  <Menu className="h-5 w-5" />
                </button>

                {/* Show dropdown for desktop view */}
                {isMobileMenuOpen && (
                  <div
                    ref={menuRef}
                    className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10 ${
                      theme === "dark"
                        ? "bg-gray-800 text-emerald-300"
                        : "bg-white text-gray-900"
                    }`}
                  >
                    <Link
                      to="/filter"
                      className="block px-4 py-2 text-lg font-medium hover:bg-gray-700 hover:text-white"
                    >
                      <Filter className="inline mr-2" />
                      Filter Data
                    </Link>
                    <Link
                      to="/chart"
                      className="block px-4 py-2 text-lg font-medium hover:bg-gray-700 hover:text-white"
                    >
                      <BarChart2 className="inline mr-2" />
                      Generate Chart
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
