import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Load saved session on app start ─────────────────
  useEffect(() => {
    async function loadSession() {
      try {
        const savedToken = await AsyncStorage.getItem("waybound_token");
        const savedUser = await AsyncStorage.getItem("waybound_user");
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.log("Session load error:", error.message);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, []);

  // ── Save session after login/register ───────────────
  async function saveSession(userData, userToken) {
    setUser(userData);
    setToken(userToken);
    await AsyncStorage.setItem("waybound_token", userToken);
    await AsyncStorage.setItem("waybound_user", JSON.stringify(userData));
  }

  // ── Clear session on logout ──────────────────────────
  async function clearSession() {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("waybound_token");
    await AsyncStorage.removeItem("waybound_user");
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, saveSession, clearSession }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}