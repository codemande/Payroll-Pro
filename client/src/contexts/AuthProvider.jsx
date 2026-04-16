import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import * as authService from "../services/authService";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const data = await authService.getMe();
      setUser(data.user);
      setIsAdmin(data.user?.role === "admin");
    } catch {
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signIn = async (email, password) => {
    try {
      await authService.login(email, password);
      await fetchUser();
      return { error: null };
    } catch {
      return { error: "Login failed" };
    }
  };

  const signUp = async (email, password, fullName) => {
    try {
      await authService.register(email, password, fullName);
      return { error: null };
    } catch {
      return { error: "Signup failed" };
    }
  };

  const signOut = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAdmin(false);
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}