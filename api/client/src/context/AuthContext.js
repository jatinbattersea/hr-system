import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";
import secureLocalStorage from "react-secure-storage";

const INITIAL_STATE = {
  user: secureLocalStorage.getItem("user") || null,
  isFetching: false,
  error: false,
};


export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  
  useEffect(()=>{
    secureLocalStorage.setItem("user", state.user);
  },[state.user])
  
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
