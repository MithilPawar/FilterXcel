import { createSlice } from "@reduxjs/toolkit";

const stableStringify = (obj) =>
  JSON.stringify(
    Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
      }, {})
  );

const toComparable = (value) => {
  if (value === null || value === undefined || value === "") {
    return { type: "empty", value: null };
  }

  if (typeof value === "number") {
    return { type: "number", value };
  }

  const numericValue = Number(value);
  if (!Number.isNaN(numericValue) && String(value).trim() !== "") {
    return { type: "number", value: numericValue };
  }

  const timestamp = Date.parse(value);
  if (!Number.isNaN(timestamp)) {
    return { type: "date", value: timestamp };
  }

  return { type: "string", value: String(value).toLowerCase() };
};

const initialState = {
  fileMetadata: null,
  originalFileData: [],
  filteredFileData: [],
  loading: false,
  error: null,
  hasDuplicates: null,
};

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setFileMetadata: (state, action) => {
      state.fileMetadata = action.payload;
    },
    clearFileMetadata: (state) => {
      state.fileMetadata = null;
    },

    setOriginalFileData: (state, action) => {
      state.originalFileData = action.payload;
    },
    clearOriginalFileData: (state) => {
      state.originalFileData = [];
    },

    setFilteredFileData: (state, action) => {
      state.filteredFileData = action.payload;
    },
    clearFilteredFileData: (state) => {
      state.filteredFileData = [];
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },

    // for sorting
    sortFilteredData: (state, action) => {
      const { column, order } = action.payload;
      state.filteredFileData.sort((a, b) => {
        const left = toComparable(a[column]);
        const right = toComparable(b[column]);

        if (left.type === "empty" && right.type !== "empty") {
          return order === "asc" ? 1 : -1;
        }
        if (right.type === "empty" && left.type !== "empty") {
          return order === "asc" ? -1 : 1;
        }

        if (left.value < right.value) return order === "asc" ? -1 : 1;
        if (left.value > right.value) return order === "asc" ? 1 : -1;
        return 0;
      });
    },

    // for searching
    filterBySearchTerm: (state, action) => {
      const term = action.payload.toLowerCase();
      state.filteredFileData = state.originalFileData.filter((row) =>
        Object.values(row).some((val) =>
          String(val ?? "").toLowerCase().includes(term)
        )
      );
    },

    // for resetting the filters applied
    resetFilteredData: (state) => {
      state.filteredFileData = [...state.originalFileData];
      state.hasDuplicates = null;
    },

    // updated to preserve column order
    renameColumn: (state, action) => {
      const { oldName, newName } = action.payload;

      const renameKeysPreservingOrder = (row) => {
        const newRow = {};
        Object.keys(row).forEach((key) => {
          if (key === oldName) {
            newRow[newName] = row[oldName];
          } else {
            newRow[key] = row[key];
          }
        });
        return newRow;
      };

      state.originalFileData = state.originalFileData.map(
        renameKeysPreservingOrder
      );
      state.filteredFileData = state.filteredFileData.map(
        renameKeysPreservingOrder
      );
    },
    // Delete the column
    deleteColumn: (state, action) => {
      const columnToDelete = action.payload;

      const removeKey = (row) => {
        const newRow = { ...row };
        delete newRow[columnToDelete];
        return newRow;
      };

      state.originalFileData = state.originalFileData.map(removeKey);
      state.filteredFileData = state.filteredFileData.map(removeKey);
    },
    // Finding duplicate
    findDuplicates: (state) => {
      const seen = new Set();
      const duplicates = [];

      state.filteredFileData.forEach((row) => {
        const rowString = stableStringify(row);

        if (seen.has(rowString)) {
          duplicates.push(row);
        } else {
          seen.add(rowString);
        }
      });

      state.filteredFileData = duplicates;
      state.hasDuplicates = duplicates.length > 0;
    },
    updateCellValue: (state, action) => {
      const { rowIndex, columnKey, newValue } = action.payload;
      if (
        state.filteredFileData[rowIndex] &&
        state.filteredFileData[rowIndex].hasOwnProperty(columnKey)
      ) {
        state.filteredFileData[rowIndex][columnKey] = newValue;
      }
    },
  },
});

export const {
  setFileMetadata,
  clearFileMetadata,
  setOriginalFileData,
  clearOriginalFileData,
  setFilteredFileData,
  clearFilteredFileData,
  setLoading,
  setError,
  resetFilteredData,
  renameColumn,
  sortFilteredData,
  filterBySearchTerm,
  deleteColumn,
  findDuplicates,
  updateCellValue,
} = fileSlice.actions;

export default fileSlice.reducer;
