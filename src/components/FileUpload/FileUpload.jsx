import { motion } from "framer-motion";

const FileUpload = ({ getRootProps, getInputProps }) => {
  return (
    <motion.div
      {...getRootProps()}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, backgroundColor: "#f9fafb" }} // Soft hover effect
      whileTap={{ scale: 0.95 }}
      className="mt-8 text-center border-2 border-dashed border-gray-400 p-6 rounded-xl cursor-pointer transition-all ease-in-out duration-300 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
    >
      <input {...getInputProps()} />
      <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
        📂 Drag & Drop or <span className="text-blue-500">Click</span> to upload an Excel file
      </p>
    </motion.div>
  );
};

export default FileUpload;
