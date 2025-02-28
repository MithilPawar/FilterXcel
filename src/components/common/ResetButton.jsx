import React from "react";
import { FaTrash } from "react-icons/fa";
import Spinner from "../common/Spinner";

const ResetButton = ({ handleReset, isResetting }) => {
  return (
    <div>
      <button
        onClick={handleReset} // Directly trigger the reset function
        disabled={isResetting}
        className={`ml-4 p-3 mt-6 rounded-full shadow-md transition duration-300 transform ${
          isResetting
            ? "bg-gray-400 cursor-not-allowed opacity-50"
            : "bg-red-500 hover:bg-red-600 hover:scale-110 active:scale-95"
        } focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
        aria-label="Reset Data"
        title="Reset Data"
      >
        {isResetting ? <Spinner /> : <FaTrash className="text-white text-xl" />}
      </button>
    </div>
  );
};

export default ResetButton;
