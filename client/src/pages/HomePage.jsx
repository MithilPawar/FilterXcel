import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileUpload from "../components/FileManager/FileUpload";
import FileMetadata from "../components/FileManager/FileMetadata";
import FilePreview from "../components/FileManager/FilePreview";
import RecentFiles from "../components/FileManager/RecentFiles";
import { useAuth } from "../AuthContext";
import { IoCloseCircleOutline } from "react-icons/io5";
import { fetchRecentFiles } from "../api";
import {
  clearFileMetadata,
  clearOriginalFileData,
  clearFilteredFileData,
  setFileMetadata,
} from "../redux/slices/fileslice";

const HomePage = () => {
  const dispatch = useDispatch();
  const { profile, isProfileLoading } = useAuth();

  const [recentFiles, setRecentFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);

  const fileMetadata = useSelector((state) => state.file.fileMetadata);
  const originalFileData = useSelector((state) => state.file.originalFileData);

  const handleFileUploadSuccess = (metadata) => {
    dispatch(setFileMetadata(metadata));
  };

  const handleClearFile = () => {
    dispatch(clearFileMetadata());
    dispatch(clearOriginalFileData());
    dispatch(clearFilteredFileData());
  };

  useEffect(() => {
    const loadRecentFiles = async () => {
      try {
        const response = await fetchRecentFiles();
        setRecentFiles(response);
      } catch (error) {
        console.error("Error fetching recent files:", error);
      } finally {
        setLoadingFiles(false);
      }
    };

    if (profile?._id) {
      loadRecentFiles();
    }
  }, [profile?._id]);

  if (isProfileLoading) return <div>Loading profile...</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Welcome Section */}
      <div className="text-center mt-10 mb-6 space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-800 dark:text-gray-100">
          Welcome to <span className="text-emerald-600">FilterXcel</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Upload your <span className="font-medium text-blue-500">Excel</span>{" "}
          or <span className="font-medium text-blue-500">CSV</span> file to
          begin analyzing and visualizing your data.
        </p>
      </div>

      {/* File Upload */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex-shrink-0">
          <FileUpload onUploadSuccess={handleFileUploadSuccess} />
        </div>
        {fileMetadata && (
          <button
            onClick={handleClearFile}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition duration-200 shadow-md cursor-pointer"
            title="Clear uploaded file"
            aria-label="Clear uploaded file"
          >
            <IoCloseCircleOutline className="w-5 h-5" />
            Clear File
          </button>
        )}
      </div>

      {/* Conditionally render Metadata and Preview */}
      <div className="mt-6 space-y-6">
        {fileMetadata && (
          <div>
            <FileMetadata file={fileMetadata} />
          </div>
        )}

        {originalFileData && originalFileData.length > 0 && (
          <div>
            <FilePreview />
          </div>
        )}
      </div>

      {/* Show RecentFiles only when no file is selected */}
      {!fileMetadata && (
        <div className="mt-10">
          <RecentFiles recentFiles={recentFiles} loadingFiles={loadingFiles} />
        </div>
      )}
    </div>
  );
};

export default HomePage;
