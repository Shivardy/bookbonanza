import { useReducer } from "react";
import createContext from "./createContext";

const initialState = { events: [], users: [] };

export const actionTypes = {
  FETCH_EVENTS: "FETCH_EVENTS",
  FETCH_EVENT_USERS: "FETCH_EVENT_USERS",
};

const appReducer = (state, action) => {
  if (action.type === actionTypes.FETCH_EVENTS) {
    return { ...state, events: action.payload };
  }
  if (action.type === actionTypes.FETCH_EVENT_USERS) {
    return { ...state, users: action.payload };
  }
  return state;
};

const [appContext, AppProvider] = createContext();

export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return <AppProvider value={{ ...state, dispatch }}>{children}</AppProvider>;
};

export { appContext };
