// src/utils/summaryStats.js
export const calculateSummaryStats = (data, column) => {
    const numericData = data.map((row) => row[column]).filter((value) => !isNaN(value));
  
    const sum = numericData.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / numericData.length;
    const median = numericData.sort((a, b) => a - b)[Math.floor(numericData.length / 2)];
  
    return { sum, avg, median };
  };
  