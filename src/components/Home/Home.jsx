import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetData, setError } from "../../redux/slices/fileSlice.js";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDropzone } from "react-dropzone";
import useFileUpload from "../../hooks/useFileUpload.js";
import FileUploader from "../FileManager/FileUpload.jsx";
import FileInfo from "../FileManager/FileInfo.jsx";
import DataPreview from "../DataTable/DataTable.jsx";
import Spinner from "../common/Spinner.jsx";
import ResetButton from "../common/ResetButton.jsx";
import { FaFilter, FaChartBar, FaFileExport } from "react-icons/fa";

const Home = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);
  const originalData = useSelector((state) => state.file.originalData);
  const isProcessing = useSelector((state) => state.file.loading);
  const error = useSelector((state) => state.file.error);

  const [selectedRows, setSelectedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const { onDrop, fileInfo } = useFileUpload();
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".xlsx, .xls, .csv",
  });

  const [resetSuccess, setResetSuccess] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the data?")) {
      setIsResetting(true);
      dispatch(resetData());
      setIsResetting(false);
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  useEffect(() => {
    if (originalData.length > 0) {
      setCurrentPage(1);
    }
  }, [originalData]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className={`w-full min-h-screen p-8 transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-white text-gray-900"
        }`}
      >
        <div className="text-center mt-6 mb-4">
          <h1 className="text-3xl font-bold">
            Welcome to <span className="text-emerald-600">FilterXcel</span>
          </h1>
          <p className="text-lg mt-2 text-gray-600">
            Upload your Excel or CSV file to begin analyzing your data.
          </p>
        </div>

        {/* File Upload Section */}
        <div className="flex justify-center items-center mb-6">
          <FileUploader getRootProps={getRootProps} getInputProps={getInputProps} />
          {originalData.length > 0 && (
            <ResetButton
              handleReset={handleReset}
              isResetting={isResetting}
              resetSuccess={resetSuccess}
            />
          )}
        </div>

        {resetSuccess && (
          <div className="text-green-500 text-center mb-4">Data has been reset!</div>
        )}

        {error && (
          <div className="text-red-500 text-center mb-6">
            {error} <button onClick={() => dispatch(setError(null))} className="ml-2 text-blue-500">Dismiss</button>
          </div>
        )}

        {fileInfo && !isProcessing && <FileInfo fileInfo={fileInfo} />}

        {isProcessing && (
          <div className="mt-4 text-center text-gray-500">
            <Spinner /> ⏳ Processing file...
          </div>
        )}

        {originalData.length > 0 && !isProcessing && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4 mt-6">Data Preview</h2>
            <DataPreview
              data={originalData}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
            />
          </div>
        )}

        {/* Feature Cards Section - Only show when no data is uploaded */}
        {originalData.length === 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              {
                icon: <FaFilter className="text-4xl mx-auto" />, 
                title: "Advanced Filtering",
                description: "Apply filters to refine your data and focus on what matters most.",
              },
              {
                icon: <FaChartBar className="text-4xl mx-auto" />, 
                title: "Data Visualization",
                description: "Generate charts and graphs to visualize trends in your data.",
              },
              {
                icon: <FaFileExport className="text-4xl mx-auto" />, 
                title: "Export Data",
                description: "Export processed data into various formats for further analysis.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg shadow-lg transition-colors duration-300 ${
                  theme === "dark" ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className={`${theme === "dark" ? "text-emerald-400" : "text-emerald-600"}`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mt-4">{feature.title}</h3>
                <p className={`mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default Home;
