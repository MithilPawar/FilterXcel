import { FaFileExcel, FaRegFileAlt } from "react-icons/fa";
import { useSelector } from "react-redux"; // Import theme state

const FileInfo = ({ fileInfo }) => {
  const { theme } = useSelector((state) => state.theme); // Get current theme

  if (!fileInfo) return null; // Prevents rendering before fileInfo is set

  return (
    <div
      className={`mt-6 shadow-lg rounded-lg p-4 flex items-center justify-between transition-all border-t-4 
      ${
        theme === "dark"
          ? "bg-gray-800 border-blue-400 text-gray-200"
          : "bg-white border-blue-500 text-gray-800"
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className={`text-3xl ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}>
          {fileInfo.name.endsWith(".xlsx") || fileInfo.name.endsWith(".xls") ? (
            <FaFileExcel />
          ) : (
            <FaRegFileAlt />
          )}
        </div>
        <div>
          <p className={`text-xl font-semibold ${theme === "dark" ? "text-gray-100" : "text-gray-800"}`}>
            <strong>{fileInfo.name}</strong>
          </p>
          <div className={`text-sm mt-1 ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            <span> | Size: {fileInfo.size}</span>
            <span className="mx-2">|</span>
            <span>Rows: {fileInfo.rows}</span>
            <span className="mx-2">|</span>
            <span>Columns: {fileInfo.columns}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileInfo;
