import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    setOrders(state, action) {
      state.orders = action.payload;
    },
    addOrder(state, action) {
      state.orders.push(action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setOrders,
  addOrder,
  setLoading,
  setError
} = ordersSlice.actions;

const OrdersReducer = ordersSlice.reducer;
export default OrdersReducer;
