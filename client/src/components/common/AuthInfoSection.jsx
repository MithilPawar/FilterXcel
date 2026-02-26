import { motion } from "framer-motion";
import AuthInfoImage from "../../assets/AuthInfo2.png";

const AuthInfoSection = () => {
  return (
    <div className="hidden md:flex w-2/5 lg:w-2/5 bg-gradient-to-br from-emerald-500 to-teal-600 items-center justify-center p-10">
      <div className="text-center text-white max-w-md flex flex-col items-center mt-[-20px] ml-4">
        
        <motion.img
          src={AuthInfoImage}
          alt="FilterXcel Illustration"
          className="w-80 h-auto max-w-full mb-4 mt-[-30px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        <motion.h2
          className="text-xl italic mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          "Turning raw data into actionable insights."
        </motion.h2>

        <motion.p
          className="text-lg mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
        >
          Unlock the power of data with seamless filtering, visualization, and exporting.
        </motion.p>

        <motion.p
          className="text-lg font-semibold mt-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
        >
          <span className="text-yellow-300">Log in</span> to unlock advanced features and save your progress!
        </motion.p>
      </div>
    </div>
  );
};

export default AuthInfoSection;
