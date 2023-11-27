import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (inputs) => {
    const res = await axios.post(
      "http://34.125.1.254:8800/api/auth/login",
      inputs
    );
    setCurrentUser(res.data);
  };

  const logout = async (inputs) => {
    await axios.post("http://34.125.1.254:8800/api/auth/logout");
    setCurrentUser(null);
  };

  const adminLogin = async (inputs) => {
    const res = await axios.post(
      "http://34.125.1.254:8800/api/auth/admin/login",
      inputs
    );
    setCurrentUser(res.data);
  };

  const adminLogout = async (inputs) => {
    await axios.post("http://34.125.1.254:8800/api/auth/admin/logout");
    setCurrentUser(null);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider
      value={{ currentUser, login, logout, adminLogin, adminLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
