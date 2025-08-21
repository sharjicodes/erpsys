import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const decoded = jwt_decode(token);
      setUser({ 
        id: decoded.user_id, 
        role: decoded.role,      // <- use role from JWT
        username: decoded.username,
        token 
      });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem("access_token", token);
    const decoded = jwt_decode(token);
    setUser({ 
      id: decoded.user_id, 
      role: decoded.role,      // <- use role from JWT
      username: decoded.username,
      token 
    });
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
