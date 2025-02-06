import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDropzone } from 'react-dropzone';
import { processFile } from '../utils/fileUtils.js';
import FileUploader from '../components/FileUpload/FileUpload.jsx';
import FileInfo from '../components/FileInfo/FileInfo.jsx';
import DataPreview from '../components/DataPreview/DataPreview.jsx';
import Pagination from '../components/Pagination/Pagination.jsx';
import SearchBar from '../components/SearchBar/SearchBar.jsx';
import FilteringComponent from '../components/Filter/FilteringComponent.jsx';
import { calculateSummaryStats } from '../utils/summaryStats.js';
import BarChart from '../components/Charts/BarChart.jsx'; // Import BarChart
import LineChart from '../components/Charts/LineChart.jsx'; // Import LineChart
import PieChart from '../components/Charts/PieChart.jsx'; // Import PieChart

const Home = () => {
  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [data, setData] = useState([]); // Original data from Excel
  const [filteredData, setFilteredData] = useState([]); // Data after filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedChart, setSelectedChart] = useState('bar');
  const [selectedColumn, setSelectedColumn] = useState('');
  const [isChartLoading, setIsChartLoading] = useState(false); // State for loading chart
  const rowsPerPage = 10;

  // File drop handling
  const onDrop = (acceptedFiles) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setIsProcessing(true);
    processFile(uploadedFile).then((fileData) => {
      setFileInfo({
        name: uploadedFile.name,
        size: (uploadedFile.size / 1024).toFixed(2) + ' KB',
        rows: fileData.length,
        columns: fileData[0] ? fileData[0].length : 0,
      });
      setData(fileData);
      setFilteredData(fileData); // Set initial filteredData same as data
      setIsProcessing(false);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.xlsx, .csv',
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
    if (page < 1 || page > Math.ceil((filteredData.length - 1) / rowsPerPage)) return;
    setCurrentPage(page);
  };

  // Summary Stats Calculation
  const summaryStats = selectedColumn ? calculateSummaryStats(filteredData, selectedColumn) : {};

  // Handle chart loading
  const handleChartChange = (chartType) => {
    setSelectedChart(chartType);
    setIsChartLoading(true);
    setTimeout(() => setIsChartLoading(false), 1000); // Simulating chart loading time
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container mx-auto p-8">
        <div className="text-center mt-6 mb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome to <span className="text-emerald-600">FilterXcel</span>
          </h1>
          <p className="text-lg mt-2 text-gray-600">Upload your Excel or CSV file to begin analyzing your data.</p>
        </div>

        {/* File Upload Section */}
        <div className="flex justify-center mb-6">
          <FileUploader getRootProps={getRootProps} getInputProps={getInputProps} />
        </div>

        {/* File Info Display */}
        {file && !isProcessing && fileInfo && (
          <div className="mb-6">
            <FileInfo fileInfo={fileInfo} />
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && <div className="mt-4 text-center text-gray-500">⏳ Processing file...</div>}

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

        {/* Chart Section (Separate from the data preview) */}
        {file && !isProcessing && data.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Data Visualization</h2>

            {/* Chart Type Selection */}
            <div className="flex mb-4">
              <button
                className={`px-4 py-2 mx-2 text-white rounded-md ${selectedChart === 'bar' ? 'bg-emerald-600' : 'bg-gray-400'}`}
                onClick={() => handleChartChange('bar')}
              >
                Bar Chart
              </button>
              <button
                className={`px-4 py-2 mx-2 text-white rounded-md ${selectedChart === 'line' ? 'bg-emerald-600' : 'bg-gray-400'}`}
                onClick={() => handleChartChange('line')}
              >
                Line Chart
              </button>
              <button
                className={`px-4 py-2 mx-2 text-white rounded-md ${selectedChart === 'pie' ? 'bg-emerald-600' : 'bg-gray-400'}`}
                onClick={() => handleChartChange('pie')}
              >
                Pie Chart
              </button>
            </div>

            {/* Column Selection for Chart */}
            <div className="mb-4">
              <label htmlFor="columnSelect" className="mr-2">Select Column for Chart</label>
              <select
                id="columnSelect"
                onChange={(e) => setSelectedColumn(e.target.value)}
                value={selectedColumn}
                className="px-4 py-2 rounded-md"
              >
                {Object.keys(filteredData[0] || {}).map((colName) => (
                  <option key={colName} value={colName}>
                    {colName}
                  </option>
                ))}
              </select>
            </div>

            {/* Render Chart */}
            {isChartLoading ? (
              <div className="text-center text-gray-500">⏳ Loading chart...</div>
            ) : selectedChart === 'bar' ? (
              <BarChart data={filteredData} column={selectedColumn} />
            ) : selectedChart === 'line' ? (
              <LineChart data={filteredData} column={selectedColumn} />
            ) : selectedChart === 'pie' ? (
              <PieChart data={filteredData} column={selectedColumn} />
            ) : null}

            {/* Display Summary Stats */}
            {selectedColumn && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold">Summary Statistics for {selectedColumn}</h3>
                <p>Sum: {summaryStats.sum}</p>
                <p>Average: {summaryStats.avg}</p>
                <p>Median: {summaryStats.median}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default Home;
