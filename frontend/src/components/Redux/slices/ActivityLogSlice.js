import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activityLogs: [],
  recentLogs: [],
  loading: false,
  error: null,
};

const activityLogSlice = createSlice({
  name: 'activityLogs',
  initialState,
  reducers: {
    setActivityLogs(state, action) {
      state.activityLogs = action.payload;
    },
    setRecentLogs(state, action) {
      state.recentLogs = action.payload;
    },
    addActivityLog(state, action) {
      state.activityLogs.unshift(action.payload);
      // Keep recent logs limited to latest 10
      if (state.recentLogs.length >= 10) {
        state.recentLogs.pop();
      }
      state.recentLogs.unshift(action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearLogs(state) {
      state.activityLogs = [];
      state.recentLogs = [];
    },
  },
});

export const { 
  setActivityLogs, 
  setRecentLogs,
  addActivityLog, 
  setLoading, 
  setError, 
  clearLogs 
} = activityLogSlice.actions;

const ActivityLogReducer = activityLogSlice.reducer;

export default ActivityLogReducer;
