import { configureStore } from "@reduxjs/toolkit";
import contactFormReducer from "./contactSlice";
import themeReducer from "./themeSlice";
import excelReducer from "./excelSlice";

const store = configureStore({
  reducer: {
    contactForm: contactFormReducer,
    theme: themeReducer,
    excel : excelReducer,
  },
});

export default store;
