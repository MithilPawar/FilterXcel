import { saveAs } from "file-saver";

const ExportButton = ({ selectedRows, currentRows }) => {
  const exportSelectedRows = () => {
    if (selectedRows.size === 0) return alert("No rows selected!");
    const selectedData = [...selectedRows].map((index) => currentRows[index]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      selectedData.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "selected_rows.csv");
  };

  return (
    <button
      className="bg-purple-500 text-white px-6 py-3 rounded-full hover:bg-purple-600 transition"
      onClick={exportSelectedRows}
    >
      ✅ Export Selected Rows
    </button>
  );
};

export default ExportButton;
