import { createContext, useContext, useState, useEffect } from "react";
import { getToken, logoutUser } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getToken();
    const storedUser = localStorage.getItem("user");

    if (token) {
      setIsAuthenticated(true);
      setUser(storedUser ? JSON.parse(storedUser) : null);
    }
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);

    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    logoutUser();

    localStorage.removeItem("user");

    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);