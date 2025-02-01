import { createSlice } from "@reduxjs/toolkit";

const storedTheme = localStorage.getItem("theme") || "light";

const initialState = {
  theme: storedTheme,
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    themeToggle: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.theme);
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(state.theme);
    },
  },
});

export const { themeToggle } = themeSlice.actions;
export default themeSlice.reducer;
