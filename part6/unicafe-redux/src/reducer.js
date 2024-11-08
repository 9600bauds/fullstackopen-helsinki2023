/* eslint-disable no-case-declarations */
const initialState = {
  good: 0,
  ok: 0,
  bad: 0,
};

const counterReducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case "GOOD":
      const previousGoods = state.good;
      const newGoods = previousGoods + 1;

      // Use the spread operator to create a new state with the "good" property overwritten
      return {
        ...state,
        good: newGoods,
      };
    case "OK":
      const newOks = state.ok + 1;

      // Use the spread operator to create a new state with the "ok" property overwritten
      return {
        ...state,
        ok: newOks,
      };
    case "BAD":
      return {
        ...state,
        bad: state.bad + 1,
      };
    case "ZERO":
      return initialState;
    default:
      return state;
  }
};

export default counterReducer;
