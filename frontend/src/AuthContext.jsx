import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext({
  userId: null,
  username: "",
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load userId from localStorage on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem("userId");
    const savedUsername = localStorage.getItem("username");
    if (savedUserId) {
      setUserId(savedUserId);
      setUsername(savedUsername || "");
    }
    setIsLoading(false);
  }, []);

  const login = (userId, username) => {
    setUserId(userId);
    setUsername(username);
    localStorage.setItem("userId", userId);
    localStorage.setItem("username", username);
  };

  const logout = () => {
    setUserId(null);
    setUsername("");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
  };

  return (
    <AuthContext.Provider value={{ userId, username, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
