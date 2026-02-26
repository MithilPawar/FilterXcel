import axios from "axios";
import * as XLSX from "xlsx";
import {
  setOriginalFileData,
  setFilteredFileData,
} from "./redux/slices/fileslice";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

const handleError = (error, fallbackMessage) => {
  throw error.response?.data || { message: fallbackMessage };
};

// ✅ Auth APIs
export const signupUser = async (data) => {
  try {
    const res = await API.post("/auth/signup", data);
    return res.data;
  } catch (err) {
    handleError(err, "Signup failed");
  }
};

export const loginUser = async (data) => {
  try {
    const res = await API.post("/auth/login", data);
    return res.data;
  } catch (err) {
    handleError(err, "Login failed");
  }
};

export const logoutUser = async () => {
  try {
    const res = await API.post("/auth/logout");
    return res.data;
  } catch (err) {
    handleError(err, "Logout failed");
  }
};

export const checkAuth = async () => {
  try {
    const res = await API.get("/auth/check-auth", { withCredentials: true });
    return { isAuthenticated: true, user: res.data.user };
  } catch (err) {
    if (err.response?.status === 401) {
      return { isAuthenticated: false, user: null };
    }
    console.error("Auth check failed", err);
    return { isAuthenticated: false, user: null };
  }
};

// ✅ File APIs
export const uploadUserFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await API.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return {
      success: true,
      message: "File uploaded successfully!",
      data: res.data,
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "File upload failed",
    };
  }
};

export const getFileById = async (fileId) => {
  try {
    const res = await API.get(`/files/${fileId}`, { responseType: "blob" });
    return res.data;
  } catch (err) {
    handleError(err, "File retrieval failed");
  }
};

export const getFileMetadata = async (fileId) => {
  try {
    const response = await API.get(`/metadata/${fileId}`);
    return response.data;
  } catch (err) {
    handleError(err, "Failed to fetch file metadata");
  }
};

export const deleteFileById = async (fileId) => {
  try {
    const res = await API.delete(`/files/${fileId}`);
    return {
      success: true,
      message: "File deleted successfully!",
      data: res.data,
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "File deletion failed",
    };
  }
};

// ✅ getting user API
export const getUser = async () => {
  try {
    const res = await API.get("/user");
    return res.data;
  } catch (err) {
    handleError(err, "Fetching user failed");
  }
};

// Updating user API
export const updateUser = async (data) => {
  try {
    const res = await API.patch("/user", data);
    return res.data;
  } catch (err) {
    handleError(err, "Profile update failed");
  }
};

// getting recent file uploaded by user
export const fetchRecentFiles = async (userId) => {
  try {
    const response = await API.get(`/recent/${userId}`);
    return response.data;
  } catch (err) {
    handleError(err, "Failed to fetch recent files");
  }
};

// ✅ Generate AI Summary API
export const generateAISummary = async (metadata) => {
  try {
    const res = await API.post("/summary", metadata);
    return res.data;
  } catch (err) {
    handleError(err, "Failed to generate AI summary");
  }
};

export const loadRecentFile = async (fileId, dispatch) => {
  try {
    const res = await API.get(`/files/download/${fileId}`);
    
    const { filename, contentType, buffer } = res.data.file;

    const byteCharacters = atob(buffer);
    const byteNumbers = new Array(byteCharacters.length)
      .fill()
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: contentType });

    const file = new File([blob], filename, { type: contentType });

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      dispatch(setOriginalFileData(jsonData));
      dispatch(setFilteredFileData(jsonData));
    };
    reader.readAsArrayBuffer(file);
  } catch (err) {
    console.error("Error loading recent file:", err);
  }
};
