import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  medicines: [],
};

const medicinesSlice = createSlice({
  name: 'medicines',
  initialState,
  reducers: {
    setMedicines(state, action) {
      state.medicines = action.payload;
    },
    addMedicine(state, action) {
      state.medicines.push(action.payload);
    },
    updateMedicine(state, action) {
      const index = state.medicines.findIndex(medicine => medicine.id === action.payload.id);
      if (index !== -1) {
        state.medicines[index] = action.payload;
      }
    },
    deleteMedicine(state, action) {
      state.medicines = state.medicines.filter(medicine => medicine.id !== action.payload);
    },
  },
});

export const { setMedicines, addMedicine, updateMedicine, deleteMedicine } = medicinesSlice.actions;
const MedicinesReducer = medicinesSlice.reducer;

export default MedicinesReducer;