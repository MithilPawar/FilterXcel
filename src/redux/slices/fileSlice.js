import { createSlice } from "@reduxjs/toolkit";
import { applyFilters } from "../../utils/filterUtils";

const initialState = {
  file: null,
  originalData: [],
  filteredData: [],
  filters: [],
  loading: false,
  error: null,
  fileInfo: null,
};

const persistedFilters = JSON.parse(localStorage.getItem("filters")) || [];
const persistedFileData = JSON.parse(localStorage.getItem("fileData")) || [];

const fileSlice = createSlice({
  name: "file",
  initialState: {
    ...initialState,
    filters: persistedFilters,
    originalData: persistedFileData,
    filteredData: applyFilters(persistedFileData, persistedFilters),
  },
  reducers: {
    setFile: (state, action) => {
      state.file = {
        name: action.payload.name,
        size: action.payload.size,
        type: action.payload.type,
      };
    },
    setData: (state, action) => {
      try {
        state.originalData = action.payload;
        state.filteredData = [...action.payload];
        state.fileInfo = null;
        if (action.payload.length > 0) {
          localStorage.setItem("fileData", JSON.stringify(action.payload));
        }
      } catch (error) {
        console.error("Error setting data:", error);
        state.error = "Failed to set data";
      }
    },
    addFilter: (state, action) => {
      try {
        const existingFilter = state.filters.find(
          (f) =>
            f.column === action.payload.column &&
            f.condition === action.payload.condition &&
            f.value === action.payload.value
        );

        if (!existingFilter) {
          state.filters.push(action.payload);
          state.filteredData = applyFilters(state.originalData, state.filters);
          localStorage.setItem("filters", JSON.stringify(state.filters));
        }
      } catch (error) {
        console.error("Error adding filter:", error);
        state.error = "Failed to add filter";
      }
    },
    removeFilter: (state, action) => {
      try {
        state.filters = state.filters.filter(
          (f) =>
            !(
              f.column === action.payload.column &&
              f.condition === action.payload.condition &&
              f.value === action.payload.value
            )
        );
        state.filteredData = applyFilters(state.originalData, state.filters);
        localStorage.setItem("filters", JSON.stringify(state.filters));
      } catch (error) {
        console.error("Error removing filter:", error);
        state.error = "Failed to remove filter";
      }
    },
    resetFilters: (state) => {
      state.filters = [];
      state.filteredData = [...state.originalData];
      localStorage.removeItem("filters");
    },
    resetData: (state) => {
      try {
        Object.assign(state, initialState);
        localStorage.clear();
      } catch (error) {
        console.error("Error resetting data:", error);
        state.error = "Failed to reset data";
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFileInfo: (state, action) => {
      state.fileInfo = action.payload;
    },
  },
});

export const {
  setFile,
  setData,
  addFilter,
  removeFilter,
  resetFilters,
  resetData,
  setLoading,
  setError,
  setFileInfo,
} = fileSlice.actions;

export default fileSlice.reducer;
