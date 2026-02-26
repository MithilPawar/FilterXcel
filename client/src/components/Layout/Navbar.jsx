import React, { useState, useMemo, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation, matchPath } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, X, ChevronDown } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../AuthContext";
import { LogOut } from "lucide-react";

const Navbar = () => {
  const theme = useSelector((state) => state.theme.theme);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, profile, isProfileLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navLinks = useMemo(
    () => [
      { path: "/home", label: "Home" },
      { path: "/about", label: "About Us" },
      { path: "/contact", label: "Contact" },
    ],
    []
  );

  const isDark = theme === "dark";
  const navbarClasses = `shadow-lg fixed top-0 left-0 w-full z-50 h-16 ${
    isDark
      ? "bg-gray-800"
      : "bg-white border-b border-gray-300 shadow-gray-400/40"
  }`;

  const linkBaseClasses =
    "text-base font-medium px-4 py-2 rounded-lg transition-all";
  const activeClasses = isDark
    ? "bg-gray-700 text-white"
    : "bg-gray-200 text-gray-900";
  const inactiveClasses = isDark
    ? "text-white hover:bg-gray-700"
    : "text-gray-700 hover:bg-gray-200";

  const isActive = (path) =>
    !!matchPath({ path, exact: true }, location.pathname);

  useEffect(() => {
    const closeDropdown = (e) => {
      if (!e.target.closest(".dropdown")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo */}
          <Link
            to="/"
            className={`text-3xl font-bold tracking-wide ${
              isDark ? "text-emerald-300" : "text-emerald-600"
            } hover:opacity-90`}
          >
            FilterXcel
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center gap-6">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`${linkBaseClasses} ${
                  isActive(path) ? activeClasses : inactiveClasses
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right Side - User & Dropdown */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative dropdown">
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  <FaUserCircle className="w-8 h-8 text-gray-500 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                    {isProfileLoading ? "Loading..." : profile?.name || "User"}
                  </span>
                  <ChevronDown
                    size={18}
                    className="text-gray-500 dark:text-gray-300"
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 overflow-hidden z-50">
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <FaUserCircle className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsDropdownOpen(false);
                      }}
                      className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500 text-white px-4 py-2 rounded-lg transition shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 text-white absolute w-full py-4 z-40">
          <div className="flex flex-col items-center gap-4">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className="text-lg font-medium py-2 px-4 hover:bg-gray-700 w-full text-center rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
