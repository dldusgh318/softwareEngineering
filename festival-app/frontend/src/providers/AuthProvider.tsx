"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { getMe, login, signup } from "@/apis/auth/auth.api";
import type { AuthResponse, AuthUser, LoginRequest, SignupRequest } from "@/types/auth.types";

type AuthContextValue = {
  accessToken: string | null;
  user: AuthUser | null;
  isInitialized: boolean;
  isAuthenticated: boolean;
  login: (request: LoginRequest) => Promise<AuthResponse>;
  signup: (request: SignupRequest) => Promise<AuthResponse>;
  logout: () => void;
};

const AUTH_TOKEN_KEY = "festival_auth_token";

const AuthContext = createContext<AuthContextValue>({
  accessToken: null,
  user: null,
  isInitialized: true,
  isAuthenticated: false,
  login: () => Promise.reject(new Error("AuthProvider is not mounted.")),
  signup: () => Promise.reject(new Error("AuthProvider is not mounted.")),
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const persistSession = useCallback((response: AuthResponse) => {
    localStorage.setItem(AUTH_TOKEN_KEY, response.accessToken);
    setAccessToken(response.accessToken);
    setUser(response.user);
    return response;
  }, []);

  const handleLogin = useCallback(
    async (request: LoginRequest) => persistSession(await login(request)),
    [persistSession],
  );

  const handleSignup = useCallback(
    async (request: SignupRequest) => persistSession(await signup(request)),
    [persistSession],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    setAccessToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem(AUTH_TOKEN_KEY);

    if (!storedToken) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsInitialized(true);
      return;
    }

    setAccessToken(storedToken);
    getMe(storedToken)
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        setAccessToken(null);
        setUser(null);
      })
      .finally(() => setIsInitialized(true));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      user,
      isInitialized,
      isAuthenticated: Boolean(accessToken && user),
      login: handleLogin,
      signup: handleSignup,
      logout,
    }),
    [accessToken, handleLogin, handleSignup, isInitialized, logout, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
