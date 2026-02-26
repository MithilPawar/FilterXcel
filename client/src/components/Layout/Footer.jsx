import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Footer = () => {
  const theme = useSelector((state) => state.theme.theme);
  const currentYear = new Date().getFullYear(); 

  return (
    <div
      className={`py-8 ${
        theme === "dark"
          ? "bg-gray-800 text-gray-300"
          : "bg-gray-100 text-gray-800"
      } shadow-xl border-t ${
        theme === "dark" ? "border-gray-700" : "border-gray-300"
      }`}
    >
      <footer className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-center sm:text-left">
          {/* Logo & Branding Section */}
          <div>
            <Link
              to="/"
              className={`text-emerald-400 text-3xl font-extrabold tracking-wide hover:text-emerald-300 ${
                theme === "dark" ? "text-emerald-300" : "text-emerald-600"
              }`}
            >
              FilterXcel
            </Link>
            <p className="text-sm mt-2">
              © {currentYear} – All rights reserved.
            </p>
            <p className="text-sm">
              Designed & Developed by the{" "}
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
            <h5 className="text-lg font-semibold mb-4">
              Why Choose FilterXcel?
            </h5>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-sm hover:text-emerald-400">
                  Simplify Excel operations with ease.
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-emerald-400">
                  No expertise required, user-friendly experience.
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-emerald-400">
                  Fast and efficient data processing.
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm hover:text-emerald-400">
                  Minimize complexity and maximize productivity.
                </Link>
              </li>
            </ul>
          </div>

          {/* About & Contact Section */}
          <div>
            <h5 className="text-lg font-semibold mb-4">About</h5>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm hover:text-emerald-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm hover:text-emerald-400">
                  Contact Us
                </Link>
              </li>
              <li className="text-sm">
                <span className="font-semibold">Email:</span>{" "}
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

        {/* Horizontal Line & Footer Text */}
        <div
          className={`border-t pt-4 mt-6 text-center ${
            theme === "dark"
              ? "border-gray-700 text-gray-500"
              : "border-gray-300 text-gray-700"
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
