import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Footer = () => {
  const theme = useSelector((state) => state.theme.theme); // Get current theme from Redux

  return (
    <div
      className={`py-8 mt-8 ${
        theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-white text-gray-800"
      } shadow-xl border-t`}
    >
      <footer className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Logo Section (Text-based FilterXcel) */}
          <div>
            <Link
              to="/"
              className={`text-emerald-400 text-3xl font-extrabold tracking-wide hover:text-emerald-300 ${
                theme === "dark" ? "text-emerald-300" : "text-emerald-600"
              }`}
            >
              FilterXcel
            </Link>
            <p
              className={`text-sm mb-3 ${
                theme === "dark" ? "text-gray-500" : "text-gray-600"
              }`}
            >
              © 2024–2025
            </p>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-500" : "text-gray-600"
              }`}
            >
              Designed and Developed by the{" "}
              <Link
                to="/home"
                className="text-emerald-400 font-medium hover:underline"
              >
                FilterXcel
              </Link>{" "}
              team.
            </p>
          </div>

          {/* Product Features Section */}
          <div>
            <h5
              className={`text-lg font-semibold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              Product Features
            </h5>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-sm hover:text-emerald-400">
                  You can perform things easier
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-emerald-400">
                  No problem, if you are not a pro in Excel
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-emerald-400">
                  No more time delay
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-emerald-400">
                  No more complexity
                </Link>
              </li>
            </ul>
          </div>

          {/* About Section */}
          <div>
            <h5
              className={`text-lg font-semibold mb-4 ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              About
            </h5>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm hover:text-emerald-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-emerald-400">
                  Contact Me
                </Link>
              </li>
              <li className="text-sm">
                <span className="font-semibold">Gmail:</span>{" "}
                <a
                  href="mailto:mithil@gmail.com"
                  className="hover:text-emerald-400"
                >
                  mithil@gmail.com
                </a>
              </li>
              <li className="text-sm">
                <span className="font-semibold">Phone:</span> +91-9860105017
              </li>
            </ul>
          </div>
        </div>

        {/* Horizontal Line */}
        <div
          className={`border-t mt-8 pt-4 text-center ${
            theme === "dark" ? "border-gray-700 text-gray-500" : "border-gray-300 text-gray-700"
          }`}
        >
          <p className="text-sm">
            Made with ❤️ by the FilterXcel team. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
