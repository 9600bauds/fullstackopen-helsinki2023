import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filter",
  initialState: null, //If the filter is null, it is treated as no filter.
  reducers: {
    setFilter(state, action) {
      //Why can't we simply do state = action.payload? I thought Immer would let us do that, now?
      //Javascript frameworks are fickle lines in the sand.
      return action.payload;
    },
  },
});

export const { setFilter } = filterSlice.actions;
export default filterSlice.reducer;
