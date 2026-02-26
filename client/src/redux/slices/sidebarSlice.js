import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarOpen: false,
  menuItems: [
    { id: 1, icon: "summary", label: "Summary", feature: "summary", enabled: true },
    { id: 2, icon: "cleaning", label: "Data Cleaning", feature: "data-cleaning", enabled: true },
    { id: 3, icon: "table", label: "Basic Operations", feature: "basic-operations", enabled: true },
    { id: 4, icon: "filter", label: "Filters", feature: "filter", enabled: true },
    { id: 5, icon: "bar-chart", label: "Charts", feature: "chart", enabled: true },
  ],
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    toggleMenuItem: (state, action) => {
      const item = state.menuItems.find((item) => item.feature === action.payload);
      if (item) item.enabled = !item.enabled;
    },
    enableMenuItem: (state, action) => {
      const item = state.menuItems.find((item) => item.feature === action.payload);
      if (item) item.enabled = true;
    },
    disableMenuItem: (state, action) => {
      const item = state.menuItems.find((item) => item.feature === action.payload);
      if (item) item.enabled = false;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, toggleMenuItem, enableMenuItem, disableMenuItem } = sidebarSlice.actions;
export default sidebarSlice.reducer;
