import { createSlice } from "@reduxjs/toolkit";

const excelSlice = createSlice({
  name: "excel",
  initialState: {
    isImported: false,
    fileData: [], // Add a field to store the data
  },
  reducers: {
    setExelImported: (state, action) => {
      state.isImported = true;
      state.fileData = action.payload; // Store the file data (e.g., rows and columns)
    },
    resestExcelImported: (state) => {
      state.isImported = false;
      state.fileData = []; // Clear the data
    },
  },
});

export const { setExelImported, resestExcelImported } = excelSlice.actions;
export default excelSlice.reducer;
