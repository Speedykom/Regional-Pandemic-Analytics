import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  show: false,
}

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state) => {
      state.show = true;
    },
    closeModal: (state) => {
      state.show = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;