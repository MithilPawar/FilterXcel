// redux/slices/excelSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isExcelImported: false,
};

const excelSlice = createSlice({
  name: "excel",
  initialState,
  reducers: {
    setExcelImported: (state, action) => {
      state.isExcelImported = action.payload;
    },
  },
});

export const { setExcelImported } = excelSlice.actions;
export default excelSlice.reducer;
