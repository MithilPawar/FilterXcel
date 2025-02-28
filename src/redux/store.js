import { configureStore } from "@reduxjs/toolkit";
import contactFormReducer from "./slices/contactSlice";
import themeReducer from "./slices/themeSlice";
import excelReducer from "./slices/excelSlice";
import fileReducer from "./slices/fileSlice";
import sidebarReducer from "./slices/sidebarSlice";

const store = configureStore({
  reducer: {
    contactForm: contactFormReducer,
    theme: themeReducer,
    excel : excelReducer,
    file: fileReducer,
    sidebar: sidebarReducer,
  },
});

export default store;
