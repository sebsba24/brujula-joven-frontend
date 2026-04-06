import { createContext, useContext, useState, useEffect } from "react";
import { getToken, logoutUser } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken  = getToken();
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      setUser(storedUser ? JSON.parse(storedUser) : null);
    }
  }, []);

  const login = (userData, tokenData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setToken(tokenData); // 👈 NUEVO

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenData); // 👈 NUEVO
  };

  const logout = () => {
    logoutUser();

    localStorage.removeItem("token");
    setToken(null);

    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);