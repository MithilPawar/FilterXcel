import { useCallback, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFile, setData, setLoading, setError } from "../redux/slices/fileSlice.js";
import { processFile } from "../utils/fileUtils.js";

const useFileUpload = () => {
  const dispatch = useDispatch();
  const [fileInfo, setFileInfo] = useState(null);
  const uploadedFile = useSelector((state) => state.file.file);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      dispatch(setError("No file selected. Please upload a valid file."));
      return;
    }

    const uploadedFile = acceptedFiles[0];
    const allowedExtensions = new Set(["xlsx", "xls", "csv"]);
    const fileExtension = uploadedFile.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.has(fileExtension)) {
      dispatch(setError("Invalid file type. Please upload an Excel or CSV file."));
      return;
    }

    dispatch(setError(null));
    
    // Dispatching only file metadata to Redux
    dispatch(setFile({
      name: uploadedFile.name,
      size: uploadedFile.size,
      type: uploadedFile.type,
    }));

    dispatch(setLoading(true));

    processFile(uploadedFile)
      .then((fileData) => {
        const fileInfoData = {
          name: uploadedFile.name,
          size: `${(uploadedFile.size / 1024).toFixed(2)} KB`,
          rows: fileData.length,
          columns: fileData[0] ? Object.keys(fileData[0]).length : 0,
        };

        setFileInfo(fileInfoData);
        dispatch(setData(fileData));
        dispatch(setLoading(false));

        sessionStorage.setItem("fileData", JSON.stringify(fileData));
        sessionStorage.setItem("fileInfo", JSON.stringify(fileInfoData));
      })
      .catch(() => {
        dispatch(setError("Error processing file. Please try again."));
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  useEffect(() => {
    if (!uploadedFile) {
      setFileInfo(null);
    }
  }, [uploadedFile]);

  return { onDrop, fileInfo };
};

export default useFileUpload;
