import { configureStore } from "@reduxjs/toolkit";
import contactFormReducer from "./contactSlice";
import themeReducer from "./themeSlice";
import excelReducer from "./excelSlice";
import fileReducer from "./fileSlice";

const store = configureStore({
  reducer: {
    contactForm: contactFormReducer,
    theme: themeReducer,
    excel : excelReducer,
    file: fileReducer,
  },
});

export default store;
