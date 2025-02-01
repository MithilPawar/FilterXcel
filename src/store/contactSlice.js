import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  formData: {
    name: "",
    email: "",
    message: "",
  },
  status: "",
};

const contactSlice = createSlice({
  name: "conatct",
  initialState,
  reducers: {
    updateForm: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    resetForm: (state) => {
      state.formData = { name: "", email: "", message: "" };
      state.status = "";
    },
  },
});

export const { updateForm, setStatus, resetForm } = contactSlice.actions;
export default contactSlice.reducer;
