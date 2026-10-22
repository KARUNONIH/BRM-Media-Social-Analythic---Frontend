import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  name: string;
  email: string;
  role: "admin" | "owner" | "marketing" | string;
  avatarUrl?: string;
  token?: string;
}

interface AuthContextValue {
  user: User | null;
  role: string | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  loginWithGoogle: (credential: string) => Promise<boolean>;
  loginAsDemoOwner: () => void;
  loginAsDemoAdmin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  isAdmin: false,
  isAuthenticated: false,
  loginWithGoogle: async () => false,
  loginAsDemoOwner: () => {},
  loginAsDemoAdmin: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("brm_auth_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("brm_auth_user");
      }
    }
  }, []);

  const loginWithGoogle = async (credential: string): Promise<boolean> => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
      const res = await fetch(`${apiUrl}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credential }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem("brm_auth_user", JSON.stringify(data.user));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const loginAsDemoOwner = () => {
    const demoUser: User = {
      name: "Direksi / Owner BRM",
      email: "owner@bumirekayasamandiri.co.id",
      role: "owner",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
      token: "demo-owner-token",
    };
    setUser(demoUser);
    localStorage.setItem("brm_auth_user", JSON.stringify(demoUser));
  };

  const loginAsDemoAdmin = () => {
    const adminUser: User = {
      name: "Gibran Anggalana (Administrator)",
      email: "gibran@bumirekayasamandiri.co.id",
      role: "admin",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      token: "demo-admin-token",
    };
    setUser(adminUser);
    localStorage.setItem("brm_auth_user", JSON.stringify(adminUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("brm_auth_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAdmin: user?.role === "admin",
        isAuthenticated: !!user,
        loginWithGoogle,
        loginAsDemoOwner,
        loginAsDemoAdmin,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
