import { createContext, useContext, useReducer } from 'react';


const defaultValue = {message: null, type: null};
const notificationContext = createContext(defaultValue);

const notificationReducer = (state, action) => {
  switch (action.type) {
  case `SET`:
    return action.payload;
  case `CLEAR`:
    return defaultValue;
  default:
    return state;
  }
};

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, defaultValue);

  return (
    <notificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </notificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const notificationAndDispatch = useContext(notificationContext);
  return notificationAndDispatch[0];
};

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(notificationContext);
  return notificationAndDispatch[1];
};

export default notificationContext;