const filterReducer = (state = "ALL", action) => {
  switch (action.type) {
    case "SET_FILTER":
      return action.payload;
    default:
      return state;
  }
};

export const setFilter = (newFilter) => {
  return {
    type: "SET_FILTER",
    payload: newFilter,
  };
};

export default filterReducer;
