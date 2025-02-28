import * as XLSX from "xlsx";

export const processFile = async (file) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      // Extract data with headers from the first row
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (rows.length === 0) {
        reject("Empty sheet");
        return;
      }

      // Get headers from the first row
      const headers = rows[0];
      const dataRows = rows.slice(1); // All rows except headers

      // Convert array data into objects with proper keys
      const formattedData = dataRows.map((row) => {
        let rowData = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index] || ""; // Map column names properly
        });
        return rowData;
      });

      resolve(formattedData);
    };

    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};
