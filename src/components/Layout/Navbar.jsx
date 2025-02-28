import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import ThemeToggle from "../common/ThemeToggle";

const Navbar = () => {
  const theme = useSelector((state) => state.theme.theme);
  const location = useLocation();

  // Memoized active path
  const activePath = useMemo(() => location.pathname, [location.pathname]);

  // Memoized navigation links
  const navLinks = useMemo(
    () => [
      { path: "/", label: "Home" },
      { path: "/about", label: "About Us" },
      { path: "/contact", label: "Contact" },
    ],
    []
  );

  // Theme-based styles
  const isDark = theme === "dark";
  const navbarBgColor = isDark
    ? "bg-gray-800 shadow-sm"
    : "bg-gray-100 border-b border-gray-300 shadow-gray-400/40 shadow-sm";

  const linkBaseClasses =
    "text-lg font-medium px-4 py-2 rounded-lg transition ease-in-out duration-300";
  const activeClasses = isDark
    ? "bg-gray-700 text-white"
    : "bg-gray-200 text-gray-900";
  const inactiveClasses = isDark
    ? "text-white hover:bg-gray-700 hover:text-white"
    : "text-gray-700 hover:bg-gray-200 hover:text-gray-900";

  return (
    <nav
      className={`${navbarBgColor} shadow-lg fixed top-0 left-0 w-full z-50 h-16`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Left Side: Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className={`text-emerald-400 text-3xl font-extrabold tracking-wide hover:text-emerald-300 ${
                isDark ? "text-emerald-300" : "text-emerald-600"
              }`}
            >
              FilterXcel
            </Link>
          </div>

          {/* Center: Navbar Links */}
          <div className="flex-1 flex justify-center space-x-6">
            {navLinks.map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`${linkBaseClasses} ${
                  activePath === path ? activeClasses : inactiveClasses
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Theme Toggle */}
          <div className="p-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
