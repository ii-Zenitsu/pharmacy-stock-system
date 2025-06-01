import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications(state, action) {
      state.notifications = action.payload;
    },
    addNotification(state, action) {
      state.notifications.unshift(action.payload);
    },
    updateNotification(state, action) {
      const index = state.notifications.findIndex(notification => notification.id === action.payload.id);
      if (index !== -1) {
        state.notifications[index] = action.payload;
      }
    },
    deleteNotification(state, action) {
      state.notifications = state.notifications.filter(notification => notification.id !== action.payload);
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const { 
  setNotifications, 
  addNotification, 
  updateNotification, 
  deleteNotification, 
  clearNotifications 
} = notificationSlice.actions;

const NotificationReducer = notificationSlice.reducer;

export default NotificationReducer;