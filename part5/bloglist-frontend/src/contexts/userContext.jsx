import { createContext, useContext, useReducer } from 'react';

const userContext = createContext();

const defaultValue = null;

const userReducer = (state, action) => {
  switch (action.type) {
  case `SET`:
    return action.payload;
  case `CLEAR`:
    return defaultValue;
  default:
    return state;
  }
};

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, defaultValue);

  return (
    <userContext.Provider value={[user, userDispatch]}>
      {props.children}
    </userContext.Provider>
  );
};

export const useUserContext = () => {
  const motificationAndDispatch = useContext(userContext);
  return motificationAndDispatch[0];
};

export const useUserDispatch = () => {
  const motificationAndDispatch = useContext(userContext);
  return motificationAndDispatch[1];
};

export default userContext;