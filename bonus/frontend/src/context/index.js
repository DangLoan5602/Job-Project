import { createContext, useEffect } from "react";
import { useSelector } from "react-redux";
import socket from "../lib/socket";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const { isAuthenticated, userInfo } = useSelector((state) => state.signIn);
  useEffect(() => {
    if (isAuthenticated) {
      return socket.emit("active-user", userInfo);
    }
  }, [isAuthenticated]);
  return <AuthContext.Provider>{children}</AuthContext.Provider>;
}
