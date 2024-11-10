import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    setNotification(state, action) {
      return action.payload;
    },
    clearNotification() {
      return null;
    },
  },
});

/**
 * Wasn't sure where to put the logic so I'm keeping it here as a non-action export of the reducer, I guess?
 */
export const showNotification = (message, seconds = 5) => {
  return async (dispatch) => {
    dispatch(setNotification(message));

    // Effectively refresh the timer if a notification already existed
    if (window.notificationTimeout) {
      clearTimeout(window.notificationTimeout);
    }

    window.notificationTimeout = setTimeout(() => {
      dispatch(clearNotification());
    }, seconds * 1000);
  };
};

export const { setNotification, clearNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
