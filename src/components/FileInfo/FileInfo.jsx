// FileInfo.jsx
import { FaFileExcel, FaRegFileAlt } from 'react-icons/fa';

const FileInfo = ({ fileInfo }) => {
  if (!fileInfo) return null; // Prevents rendering before fileInfo is set

  return (
    <div className="mt-6 bg-white shadow-lg rounded-lg p-4 flex items-center justify-between transition-all hover:shadow-xl hover:scale-105 border-t-4 border-blue-500">
      <div className="flex items-center space-x-3">
        <div className="text-3xl text-blue-600">
          {fileInfo.name.endsWith(".xlsx") || fileInfo.name.endsWith(".xls") ? (
            <FaFileExcel />
          ) : (
            <FaRegFileAlt />
          )}
        </div>
        <div>
          <p className="text-xl font-semibold text-gray-800">
            <strong>{fileInfo.name}</strong>
          </p>
          <div className="text-gray-500 text-sm mt-1">
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
