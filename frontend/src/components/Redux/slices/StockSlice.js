import { createSlice } from '@reduxjs/toolkit';

// The structure of a "stock item" will depend on your backend.
// It might include medicine details, location details, and quantity.
// Example: { medicine_id, medicine_name, location_id, location_name, quantity, last_updated }

const initialState = {
  stockItems: [], // Holds the list of stock items
  loading: false,
  error: null,
};

const stockSlice = createSlice({
  name: 'stock',
  initialState,
  reducers: {
    setStockItems(state, action) {
      state.stockItems = action.payload;
    },
    // addStockItem might not be directly used if stock is derived or managed via transactions
    addStockItem(state, action) {
      state.stockItems.push(action.payload);
    },
    // updateStockItem could be used for real-time updates or after an adjustment
    updateStockItem(state, action) {
      const index = state.stockItems.findIndex(
        // Assuming a composite key or unique ID for a stock item
        item => item.id === action.payload.id || (item.medicine_id === action.payload.medicine_id && item.location_id === action.payload.location_id)
      );
      if (index !== -1) {
        state.stockItems[index] = action.payload;
      } else {
        // Optionally add if not found, or handle as an error
        state.stockItems.push(action.payload);
      }
    },
    // deleteStockItem might be used if a stock entry (e.g., medicine at a location) is removed
    deleteStockItem(state, action) { // action.payload could be an id or { medicine_id, location_id }
      state.stockItems = state.stockItems.filter(item => {
        if (action.payload.id) return item.id !== action.payload.id;
        if (action.payload.medicine_id && action.payload.location_id) {
          return !(item.medicine_id === action.payload.medicine_id && item.location_id === action.payload.location_id);
        }
        return true; // Or handle error if payload is not specific enough
      });
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    }
  },
});

export const { setStockItems, addStockItem, updateStockItem, deleteStockItem, setLoading, setError } = stockSlice.actions;
const StockReducer = stockSlice.reducer;

export default StockReducer;
