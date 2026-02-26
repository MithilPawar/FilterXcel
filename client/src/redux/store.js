import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import sidebarReducer from "./slices/sidebarSlice";
import fileReducer from "./slices/fileslice";

const store = configureStore({
  reducer: {
    theme: themeReducer,
    sidebar: sidebarReducer,
    file : fileReducer,
  },
});

export default store;
