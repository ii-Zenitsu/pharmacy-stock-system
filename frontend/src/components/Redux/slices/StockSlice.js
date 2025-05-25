import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stockItems: [],
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
    addStockItem(state, action) {
      state.stockItems.push(action.payload);
    },
    updateStockItem(state, action) {
      const index = state.stockItems.findIndex(stock => stock.id === action.payload.id);
      if (index !== -1) {
        state.stockItems[index] = action.payload;
      }
    },
    adjustBatchesQuantity(state, action) {
      action.payload.forEach(batch => {
        const index = state.stockItems.findIndex(stock => stock.id === batch.id);
        if (index !== -1) {
          state.stockItems[index] = batch;
        }
      });
    },
    deleteStockItem(state, action) {
      state.stockItems = state.stockItems.filter(item => item.id !== action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    }
  },
});

export const { setStockItems, addStockItem, updateStockItem, deleteStockItem, adjustBatchesQuantity, setLoading, setError } = stockSlice.actions;
const StockReducer = stockSlice.reducer;

export default StockReducer;
