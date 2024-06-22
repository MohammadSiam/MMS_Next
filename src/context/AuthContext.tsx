"use client";
import { getRoleFromToken, getToken } from "@/utils/session";
import { ReactNode, createContext, useEffect, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: string | null;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setUserRole: (userRole: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>({
  isLoggedIn: false,
  userRole: null,
  setIsLoggedIn: () => {},
  setUserRole: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsLoggedIn(true);
      const role = getRoleFromToken(token);
      setUserRole(role);
    }
  }, [userRole]);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userRole, setIsLoggedIn, setUserRole }}
    >
      {children}
    </AuthContext.Provider>
  );
}
