import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URL } from "../config";

let socket = null;

// ── Connect to Socket.io server ──────────────────────
export async function connectSocket() {
  if (socket && socket.connected) return socket;

  const token = await AsyncStorage.getItem("waybound_token");

  // Use require inside function to avoid Metro bundling issues
  const { io } = require("socket.io-client");

  socket = io(SERVER_URL, {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    forceNew: true,
  });

  socket.on("connect", () => {
    console.log("⚡ Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("🔴 Socket disconnected");
  });

  socket.on("connect_error", (err) => {
    console.log("❌ Socket error:", err.message);
  });

  return socket;
}

// ── Get existing socket instance ─────────────────────
export function getSocket() {
  return socket;
}

// ── Disconnect ───────────────────────────────────────
export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}