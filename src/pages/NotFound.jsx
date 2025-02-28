import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen p-6 text-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md">
        {/* Animated 404 Text */}
        <motion.h1
          className="text-6xl font-extrabold text-red-600 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          404
        </motion.h1>

        {/* Subheading */}
        <motion.p
          className="text-lg text-gray-700 dark:text-gray-300 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Oops! The page you're looking for doesn't exist. <br />
          It might have been moved or deleted.
        </motion.p>

        {/* Image Placeholder */}
        <motion.img
          src="/images/error.png"
          alt="404 Not Found"
          className="w-64 mx-auto mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        />

        {/* Home Button */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, duration: 0.3, type: "spring" }}
        >
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-105 transition transform"
          >
            Go Back Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
