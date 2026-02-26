import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaFilter, FaChartBar, FaFileExport } from "react-icons/fa";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-600 to-emerald-700 text-white px-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-extrabold">Welcome to FilterXcel</h1>
        <p className="mt-2 text-lg opacity-90">Easily filter, analyze, and export Excel files</p>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center max-w-3xl"
      >
        <FeatureCard icon={<FaFilter size={30} />} title="Advanced Filtering" description="Filter your Excel data with ease." />
        <FeatureCard icon={<FaChartBar size={30} />} title="Data Visualization" description="Create insightful charts & graphs." />
        <FeatureCard icon={<FaFileExport size={30} />} title="Export & Save" description="Download filtered data in various formats." />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="mt-8 flex flex-col sm:flex-row gap-4"
      >
        <button
          onClick={() => navigate("/home")}
          className="bg-green-500 px-6 py-3 rounded-xl shadow-md hover:bg-green-600 transition duration-300 text-lg"
        >
          Continue as Guest
        </button>

        <button
          onClick={() => navigate("/login")}
          className="bg-gray-900 px-6 py-3 rounded-xl shadow-md hover:bg-gray-800 transition duration-300 text-lg"
        >
          Sign Up / Login
        </button>
      </motion.div>

      {/* Footer Section */}
      <p className="mt-6 text-sm opacity-75">Transform how you handle Excel data!</p>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white text-gray-900 p-6 rounded-xl shadow-lg"
  >
    <div className="text-green-600 mb-3">{icon}</div>
    <h3 className="text-xl font-semibold">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </motion.div>
);

export default Landing;
