import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDropzone } from "react-dropzone";
import { processFile } from "../utils/fileUtils.js";
import FileUploader from "../components/FileUpload/FileUpload.jsx";
import FileInfo from "../components/FileInfo/FileInfo.jsx";
import DataPreview from "../components/DataPreview/DataPreview.jsx";
import Pagination from "../components/Pagination/Pagination.jsx";
import SearchBar from "../components/SearchBar/SearchBar.jsx";
import FilteringComponent from "../components/Filter/FilteringComponent.jsx";
import ChartSelector from "../components/Charts/ChartSelector.jsx"; // Import ChartSelector

const Home = () => {
  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); // Data after filtering
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedColumn, setSelectedColumn] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // File drop handling
  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setIsProcessing(true);
    processFile(uploadedFile).then((fileData) => {
      setFileInfo({
        name: uploadedFile.name,
        size: (uploadedFile.size / 1024).toFixed(2) + " KB",
        rows: fileData.length,
        columns: fileData[0] ? fileData[0].length : 0,
      });
      setData(fileData);
      setFilteredData(fileData);
      setIsProcessing(false);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".xlsx, .csv",
  });

  // Apply search filtering
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
      return;
    }

    const lowerSearch = searchTerm.toLowerCase();
    const searchedData = data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(lowerSearch)
      )
    );

    setFilteredData(searchedData);
  }, [searchTerm, data]);

  // Function to update current page when pagination is triggered
  const handlePaginationChange = (page) => {
    if (page < 1 || page > Math.ceil((filteredData.length - 1) / rowsPerPage))
      return;
    setCurrentPage(page);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-8">
        <div className="text-center mt-6 mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to <span className="text-emerald-600">FilterXcel</span>
          </h1>
          <p className="text-lg mt-2 text-gray-600">
            Upload your Excel or CSV file to begin analyzing your data.
          </p>
        </div>

        {/* File Upload Section */}
        <div className="flex justify-center mb-6">
          <FileUploader
            getRootProps={getRootProps}
            getInputProps={getInputProps}
          />
        </div>

        {/* File Info Display */}
        {file && !isProcessing && fileInfo && (
          <div className="mb-6">
            <FileInfo fileInfo={fileInfo} />
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="mt-4 text-center text-gray-500">
            ⏳ Processing file...
          </div>
        )}

        {/* Data and Filter Section */}
        {file && !isProcessing && data.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Data Preview</h2>

            {/* Search Bar */}
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            {/* Filtering Component */}
            <FilteringComponent data={data} setFilteredData={setFilteredData} />

            {/* Data Table */}
            <DataPreview
              data={filteredData}
              selectedRows={selectedRows}
              setSelectedRows={setSelectedRows}
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
            />

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              setCurrentPage={handlePaginationChange}
              totalPages={Math.ceil((filteredData.length - 1) / rowsPerPage)}
            />
          </div>
        )}

        {/* Chart Section */}
        {file && !isProcessing && data.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Data Visualization</h2>
            <ChartSelector
              data={data}
              selectedColumn={selectedColumn} 
              setSelectedColumn={setSelectedColumn} 
            />
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default Home;
