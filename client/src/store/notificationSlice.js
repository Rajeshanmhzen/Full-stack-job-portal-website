import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    items: [],
    unreadCount: 0,
  },
  reducers: {
    setNotifications: (state, action) => {
      state.items = action.payload;
      state.unreadCount = action.payload.filter(n => !n.isRead).length;
    },
    addNotification: (state, action) => {
      const exists = state.items.find(item => item._id === action.payload._id);
      if (!exists) {
        state.items.unshift(action.payload); 
        if (!action.payload.isRead) state.unreadCount += 1;
      }
    },
    markAllRead: (state) => {
      state.unreadCount = 0;
      state.items.forEach(item => item.isRead = true);
    },
    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
    refreshNotifications: (state) => {
      // Trigger for refresh
    },
  },
});

export const { setNotifications, addNotification, markAllRead, clearNotifications, refreshNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
