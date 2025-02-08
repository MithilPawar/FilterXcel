import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFile, setData, filterData, setLoading, setError } from "../store/fileSlice.js";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDropzone } from "react-dropzone";
import { processFile } from "../utils/fileUtils.js";
import FileUploader from "../components/FileUpload/FileUpload.jsx";
import FileInfo from "../components/FileInfo/FileInfo.jsx";
import DataPreview from "../components/DataPreview/DataPreview.jsx";
import Pagination from "../components/Pagination/Pagination.jsx";
import SearchBar from "../components/SearchBar/SearchBar.jsx";
import Spinner from "../components/Spinner/Spinner.jsx";

const Home = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);
  const file = useSelector((state) => state.file.file);
  const data = useSelector((state) => state.file.data);
  const filteredData = useSelector((state) => state.file.filteredData);
  const isProcessing = useSelector((state) => state.file.loading);
  const error = useSelector((state) => state.file.error);

  const [fileInfo, setFileInfo] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const onDrop = useCallback((acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];

    if (!uploadedFile) {
      dispatch(setError("No file selected. Please upload a valid file."));
      return;
    }

    const allowedExtensions = ["xlsx", "xls", "csv"];
    const fileExtension = uploadedFile.name.substring(uploadedFile.name.lastIndexOf(".") + 1).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      dispatch(setError("Invalid file type. Please upload an Excel or CSV file."));
      return;
    }

    dispatch(setError(null));
    dispatch(setFile(uploadedFile));
    dispatch(setLoading(true));

    processFile(uploadedFile)
      .then((fileData) => {
        setFileInfo({
          name: uploadedFile.name,
          size: (uploadedFile.size / 1024).toFixed(2) + " KB",
          rows: fileData.length,
          columns: fileData[0] ? fileData[0].length : 0,
        });

        dispatch(setData(fileData));
        dispatch(setLoading(false));
      })
      .catch(() => {
        dispatch(setError("Error processing file. Please try again."));
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".xlsx, .xls, .csv",
  });

  const handleSearch = useCallback((searchTerm) => {
    dispatch(filterData(searchTerm));
  }, [dispatch]);

  useEffect(() => {
    if (filteredData.length === 0) {
      setCurrentPage(1);
    }
  }, [filteredData]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage));

  const handlePaginationChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        className={`container mx-auto p-8 transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-white text-gray-900"
        }`}
      >
        <div className="text-center mt-6 mb-4">
          <h1 className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"}`} aria-label="FilterXcel Home Page">
            Welcome to{" "}
            <span className={`${theme === "dark" ? "text-emerald-300" : "text-emerald-600"}`}>
              FilterXcel
            </span>
          </h1>
          <p className={`text-lg mt-2 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
            Upload your Excel or CSV file to begin analyzing your data.
          </p>
        </div>

        {/* File Upload Section */}
        <div className="flex justify-center mb-6">
          <FileUploader getRootProps={getRootProps} getInputProps={getInputProps} />
        </div>

        {/* Error Message with Dismiss Option */}
        {error && (
          <div className="text-red-500 text-center mb-6">
            {error}{" "}
            <button onClick={() => dispatch(setError(null))} className="ml-2 text-blue-500">
              Dismiss
            </button>
          </div>
        )}

        {/* File Info Display */}
        {file && !isProcessing && fileInfo && (
          <div className="mb-6">
            <FileInfo fileInfo={fileInfo} />
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="mt-4 text-center text-gray-500">
            <Spinner /> ⏳ Processing file...
          </div>
        )}

        {/* Data and Filter Section */}
        {file && !isProcessing && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Data Preview</h2>

            <SearchBar searchTerm="" setSearchTerm={handleSearch} theme={theme} />

            {filteredData.length === 0 ? (
              <div className="text-center text-gray-500 mt-4">No matching records found.</div>
            ) : (
              <>
                <DataPreview
                  data={filteredData}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  currentPage={currentPage}
                  rowsPerPage={rowsPerPage}
                />

                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={handlePaginationChange}
                  totalPages={totalPages}
                />
              </>
            )}
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default Home;
