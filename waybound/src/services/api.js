import AsyncStorage from "@react-native-async-storage/async-storage";

// ── Base URL ─────────────────────────────────────────
// This works because of: adb reverse tcp:3000 tcp:3000
const BASE_URL = "http://localhost:3000/api";

// ── Helper: get stored token ─────────────────────────
async function getToken() {
  return await AsyncStorage.getItem("waybound_token");
}

// ── Helper: base fetch with auth header ─────────────
async function request(endpoint, options = {}) {
  const token = await getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

// ── Auth ─────────────────────────────────────────────
export async function registerUser({ name, email, password, avatar }) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, avatar }),
  });
}

export async function loginUser({ email, password }) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// ── Rooms ─────────────────────────────────────────────
export async function createRoom({ name, icon, maxMembers, isPrivate, safetyAlerts, shareLocation }) {
  return request("/rooms/create", {
    method: "POST",
    body: JSON.stringify({ name, icon, maxMembers, isPrivate, safetyAlerts, shareLocation }),
  });
}

export async function joinRoom({ code }) {
  return request("/rooms/join", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export async function getRoomDetails(roomId) {
  return request(`/rooms/${roomId}`);
}

export async function endRoom(roomId) {
  return request(`/rooms/${roomId}/end`, {
    method: "PATCH",
  });
}

export async function savePushToken(pushToken) {
  return request("/auth/push-token", {
    method: "POST",
    body: JSON.stringify({ pushToken }),
  });
}

export async function getMyRooms() {
  return request("/rooms/my-rooms");
}