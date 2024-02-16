import React, { useState } from "react";
import Cookies from "universal-cookie";

export const AuthContext = React.createContext(null);
const cookies = new Cookies();

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [ip] = useState("/api");

  const localToken = cookies.get("token");
  const localId = cookies.get("userId");

  if (localToken && !token) {
    setToken(localToken);
    setUserId(localId);
  }

  const login = (token, userId) => {
    setToken(token);
    setUserId(userId);

    cookies.set("token", token, {
      maxAge: 2 * 60 * 60,
    });
    cookies.set("userId", userId, {
      maxAge: 2 * 60 * 60,
    });
  };
  const logout = () => {
    setToken(null);
    setUserId(null);

    cookies.remove("token");
    cookies.remove("userId");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        userId,
        ip,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
