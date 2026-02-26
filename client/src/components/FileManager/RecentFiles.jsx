import React, { useState } from "react";
import { IoDocumentText, IoReload } from "react-icons/io5";
import { loadRecentFile, getFileMetadata } from "../../api";
import { useDispatch } from "react-redux";
import { setFileMetadata } from "../../redux/slices/fileslice";

const RecentFiles = ({ recentFiles, loadingFiles }) => {
  const dispatch = useDispatch();
  const [loadingFileId, setLoadingFileId] = useState(null);

  const handleFileClick = async (fileId) => {
    setLoadingFileId(fileId);
    try {
      await loadRecentFile(fileId, dispatch);
      const metadata = await getFileMetadata(fileId);
      dispatch(setFileMetadata(metadata));
    } catch (error) {
      console.error("Error loading file or metadata:", error);
    } finally {
      setLoadingFileId(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow mt-10 max-w-3xl mx-auto">
      <h2 className="text-lg font-semibold mb-1 text-gray-800 dark:text-white">
        Recent Files
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Click any file to reload its data and metadata.
      </p>

      {loadingFiles ? (
        <p className="text-gray-600 dark:text-gray-400">Loading recent files...</p>
      ) : recentFiles.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No recent files found.</p>
      ) : (
        <ul className="space-y-2">
          {recentFiles.map((file) => (
            <li
              key={file._id}
              onClick={() => handleFileClick(file._id)}
              className="flex items-center p-2 border-l-4 border-transparent hover:border-blue-500 dark:hover:border-blue-300 transition-all duration-200 cursor-pointer"
              title="Click to reload this file"
            >
              <div className="flex-shrink-0 flex items-center space-x-2">
                <IoDocumentText className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {loadingFileId === file._id ? (
                  <IoReload className="w-5 h-5 animate-spin text-blue-600 dark:text-blue-400" />
                ) : (
                  <IoReload className="w-4 h-4 text-gray-400 dark:text-gray-600 opacity-50 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
              <div className="ml-3 flex-1">
                <div className="font-medium text-gray-900 dark:text-white text-sm truncate">
                  {file.filename}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Size: {(file.size / 1024).toFixed(2)} KB
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentFiles;
