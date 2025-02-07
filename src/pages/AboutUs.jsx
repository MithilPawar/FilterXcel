import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const AboutUs = () => {
  const theme = useSelector((state) => state.theme.theme);
  
  return (
    <section className={`py-12 ${theme === "dark" ? "bg-gray-900 text-gray-200" : "bg-white text-gray-800"}`}>
      <div className="container mx-auto px-6">
        {/* Title */}
        <h2 className={`text-4xl font-bold text-center mb-12 ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
          FilterXcel
        </h2>

        {/* Team Introduction */}
        <div className="flex flex-col items-center text-center mb-16">
          <p className={`text-lg max-w-3xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
            FilterXcel is a collaborative project developed by two passionate individuals, Mithil Pawar and Pranay Chavan.
            Our mission is to simplify Excel operations and make data manipulation and visualization accessible to everyone.
          </p>
        </div>

        {/* Making Excel More Accessible */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-100"} rounded-lg shadow-lg p-8 flex flex-col items-start`}>
            <img
              src="https://via.placeholder.com/400x250"
              alt="Making Excel More Accessible"
              className="w-full h-48 object-cover rounded-lg mb-6"
            />
            <h3 className={`text-2xl font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"} mb-4`}>
              Making Excel More Accessible
            </h3>
            <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              FilterXcel is dedicated to making Excel more accessible for non-technical users. Our goal is to remove the intimidation factor and provide an intuitive, user-friendly interface.
            </p>
          </div>

          <div className={`${theme === "dark" ? "bg-gray-800" : "bg-gray-100"} rounded-lg shadow-lg p-8 flex flex-col items-start`}>
            <img
              src="https://via.placeholder.com/400x250"
              alt="Empowering Excel Users"
              className="w-full h-48 object-cover rounded-lg mb-6"
            />
            <h3 className={`text-2xl font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"} mb-4`}>
              Empowering Excel Users
            </h3>
            <p className={`text-lg ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Our mission is to empower users to unlock the full potential of Excel's data manipulation and filtering capabilities.
            </p>
          </div>
        </div>

        {/* Developer Profiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Developer 1 */}
          <div className="flex flex-col items-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Mithil Pawar"
              className="w-32 h-32 rounded-full mb-4"
            />
            <h3 className={`text-xl font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
              Mithil Pawar
            </h3>
            <p className="text-sm text-gray-500 mb-4">Co-Developer | Full Stack Developer</p>
            <p className={`text-sm max-w-md mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              With a strong background in software development and a passion for building user-friendly applications, Mithil is responsible for the front-end and overall architecture of the FilterXcel platform.
            </p>
            <div className="mt-4">
              <Link
                to="https://www.linkedin.com/in/mithil-pawar"
                className="text-emerald-400 hover:underline"
              >
                Connect with Mithil
              </Link>
            </div>
          </div>

          {/* Developer 2 */}
          <div className="flex flex-col items-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Pranay Chavan"
              className="w-32 h-32 rounded-full mb-4"
            />
            <h3 className={`text-xl font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>
              Pranay Chavan
            </h3>
            <p className="text-sm text-gray-500 mb-4">Co-Developer | Backend Developer</p>
            <p className={`text-sm max-w-md mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
              Pranay is focused on the back-end development, ensuring that FilterXcel is scalable, secure, and provides a seamless experience to users.
            </p>
            <div className="mt-4">
              <Link
                to="https://www.linkedin.com/in/pranay-chavan"
                className="text-emerald-400 hover:underline"
              >
                Connect with Pranay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
