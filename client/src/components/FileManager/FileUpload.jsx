import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import * as XLSX from "xlsx";
import {
  setFileMetadata,
  setOriginalFileData,
  setFilteredFileData,
  setError,
  setLoading,
} from "../../redux/slices/fileslice";
import { uploadUserFile, getFileMetadata } from "../../api";
import { CheckCircle, XCircle } from "lucide-react";

const FileUpload = ({ onUploadSuccess }) => {
  const dispatch = useDispatch();
  const [error, setErrorMsg] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg("");
    setSuccessMessage("");

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const fileBuffer = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsArrayBuffer(file);
      });

      const data = new Uint8Array(fileBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      dispatch(setOriginalFileData(jsonData));
      dispatch(setFilteredFileData(jsonData));

      const response = await uploadUserFile(file);
      if (!response.success || !response.data?.fileId) {
        throw new Error(response.message || "File upload failed");
      }

      const metadata = await getFileMetadata(response.data.fileId);
      dispatch(setFileMetadata(metadata));
      onUploadSuccess(metadata);

      setSuccessMessage("File uploaded and data loaded successfully!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      const errMsg = err.message || "Upload failed";
      setErrorMsg(errMsg);
      dispatch(setError(errMsg));
    } finally {
      setUploading(false);
      dispatch(setLoading(false));
    }
  }, [dispatch, onUploadSuccess]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    multiple: false,
  });

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <motion.div
        {...getRootProps()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02, backgroundColor: "#f9fafb" }}
        whileTap={{ scale: 0.98 }}
        className="text-center border-2 border-dashed border-gray-400 p-6 rounded-xl cursor-pointer transition-all ease-in-out duration-300 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700"
      >
        <input {...getInputProps()} />
        <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
          📂 Drag & Drop or <span className="text-blue-500">Click</span> to upload an Excel file
        </p>
        {uploading && <p className="mt-2 text-sm text-blue-600">Uploading...</p>}
      </motion.div>

      {successMessage && (
        <div className="flex items-center gap-2 text-green-700 bg-green-100 p-3 rounded-lg text-sm">
          <CheckCircle className="w-5 h-5" />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-700 bg-red-100 p-3 rounded-lg text-sm">
          <XCircle className="w-5 h-5" />
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
