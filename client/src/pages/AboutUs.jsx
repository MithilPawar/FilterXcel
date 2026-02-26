import React from "react";
import { useSelector } from "react-redux";

const AboutUs = () => {
  const theme = useSelector((state) => state.theme.theme);
  const isDark = theme === "dark";

  return (
    <section
      className={`py-12 px-4 transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-800"
      }`}
    >
      <div className="container mx-auto max-w-6xl">
        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6">FilterXcel</h2>

        {/* Team Introduction */}
        <p
          className={`text-center max-w-2xl mx-auto ${
            isDark ? "text-gray-400" : "text-gray-600"
          } mb-8`}
        >
          <strong>FilterXcel</strong> is a collaborative project by{" "}
          <strong>Mithil Pawar</strong> and <strong>Pranay Chavan</strong>.
          Our mission is to simplify Excel operations and enhance data visualization.
        </p>

        {/* Features Section (With Hover Effects) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: "🔍 Making Excel Simple",
              desc: "Providing a user-friendly experience for easy Excel operations.",
            },
            {
              title: "📊 Data Visualization",
              desc: "Unlock powerful Excel filtering and visualization capabilities.",
            },
            {
              title: "⚡ Performance Optimized",
              desc: "Fast, responsive, and optimized for smooth performance.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`shadow-md rounded-lg p-4 transition-all duration-300 ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <h3 className="text-lg font-semibold mb-1">{feature.title}</h3>
              <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Developer Profiles (No Hover Effect) */}
        <h3 className="text-xl font-semibold text-center mt-12 mb-6">
          Meet the Developers
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: "Mithil Pawar",
              role: "Co-Developer | Full Stack Developer",
              desc: "Mithil is responsible for the front-end and architecture of FilterXcel.",
              link: "https://www.linkedin.com/in/mithil-pawar",
            },
            {
              name: "Pranay Chavan",
              role: "Co-Developer | Backend Developer",
              desc: "Pranay ensures that FilterXcel is scalable, secure, and efficient.",
              link: "https://shorturl.at/sf94N",
            },
          ].map((dev, index) => (
            <div
              key={index}
              className={`flex flex-col items-center p-4 rounded-lg shadow-md border ${
                isDark ? "bg-gray-800 border-gray-700 text-gray-300" : "bg-white border-gray-200 text-gray-700"
              }`}
            >
              <a href={dev.link} target="_blank" rel="noopener noreferrer">
                <img
                  src={dev.img}
                  alt={dev.name}
                  className="w-24 h-24 rounded-full mb-3 shadow-sm"
                />
              </a>
              <h3 className="text-lg font-semibold">{dev.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{dev.role}</p>
              <p className="text-sm text-center px-4">{dev.desc}</p>
              <a
                href={dev.link}
                className="mt-3 text-emerald-400 hover:underline text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Connect with {dev.name.split(" ")[0]}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
