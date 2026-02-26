import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

// Export to CSV
export const exportToCSV = (data, fileName = "export.csv") => {
  const csvData = convertToCSV(data);
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, fileName);
};

// Export to Excel
export const exportToExcel = (data, fileName = "export.xlsx") => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, fileName);
};

// Export to JSON
export const exportToJSON = (data, fileName = "export.json") => {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  saveAs(blob, fileName);
};

// Helper function to convert data to CSV format
const convertToCSV = (data) => {
  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((header) => `"${row[header]}"`).join(",")
  );
  return [headers.join(","), ...rows].join("\n");
};
