import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  file: null,
  data: [],
  filteredData: [],
  loading: false,
  error: null,
};

const fileSlice = createSlice({
  name: "file",
  initialState,
  reducers: {
    setFile: (state, action) => {
      state.file = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    filterData: (state, action) => {
      const searchTerm = action.payload.toLowerCase();
      state.filteredData = state.data.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchTerm)
        )
      );
    },
    setData: (state, action) => {
      state.data = action.payload;
      state.filteredData = action.payload; // Initially, filteredData = data
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setFile, setData, filterData, setLoading, setError } =
  fileSlice.actions;
export default fileSlice.reducer;
