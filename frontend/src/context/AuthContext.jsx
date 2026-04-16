import { createContext, useContext, useEffect, useMemo, useState } from "react";
import apiClient from "../api/client";

const AuthContext = createContext(null);
const AUTH_STORAGE_KEY = "rbac_auth_token";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(AUTH_STORAGE_KEY) || "");
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(token));

  const isAuthenticated = Boolean(token && currentUser);

  const login = async ({ identifier, password }) => {
    const response = await apiClient.login({ identifier, password });
    const nextToken = response.token;

    localStorage.setItem(AUTH_STORAGE_KEY, nextToken);
    setToken(nextToken);
    setCurrentUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setToken("");
    setCurrentUser(null);
  };

  const refreshMe = async (targetToken = token) => {
    if (!targetToken) {
      return;
    }

    const response = await apiClient.getMe(targetToken);
    setCurrentUser(response.data);
  };

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        await refreshMe(token);
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      currentUser,
      isAuthenticated,
      isLoading,
      login,
      logout,
      refreshMe,
      setCurrentUser
    }),
    [token, currentUser, isAuthenticated, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth };
