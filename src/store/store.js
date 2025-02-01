import { configureStore } from "@reduxjs/toolkit";
import contactFormReducer from "./contactSlice";
import themeReducer from "./themeSlice";

const store = configureStore({
  reducer: {
    contactForm: contactFormReducer,
    theme: themeReducer,
  },
});

export default store;
