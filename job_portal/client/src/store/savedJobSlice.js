import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  savedJobs: [],
};

const savedJobSlice = createSlice({
  name: "savedJob",
  initialState,
  reducers: {
    setSavedJobs: (state, action) => {
      state.savedJobs = action.payload;
    },
    addSavedJob: (state, action) => {
      if (!state.savedJobs.includes(action.payload)) {
        state.savedJobs.push(action.payload);
      }
    },
    removeSavedJob: (state, action) => {
      state.savedJobs = state.savedJobs.filter(id => id !== action.payload);
    },
  },
});

export const { setSavedJobs, addSavedJob, removeSavedJob } = savedJobSlice.actions;
export default savedJobSlice.reducer;
