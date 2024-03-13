import React, { createContext, useState, useContext, useEffect } from "react";
import ServerAPI from "../api/ServerAPI";
import { jwtDecode } from "jwt-decode";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("ServerToken");
    if (storedToken) {
      ServerAPI.token = storedToken;
      const decoded = jwtDecode(storedToken);
      if (decoded) {
        setUser({
          email: decoded.email,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          isAdmin: decoded.isAdmin,
        });
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
