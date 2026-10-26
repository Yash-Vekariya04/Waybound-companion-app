// ── Simple notification helpers ──────────────────────
// Full push notifications will be added in Phase 7
// production build. For now we use Alert popups.

export async function registerForPushNotifications() {
  // Will be implemented in Phase 7 production build
  console.log("ℹ️ Push notifications will be enabled in production build");
  return null;
}

export async function showLocalNotification({ title, body }) {
  // No-op in Expo Go — SOS uses Alert popup instead
  console.log("🔔 Notification:", title, body);
}

export async function showSOSNotification({ senderName, message }) {
  // No-op in Expo Go — SOS uses Alert popup instead
  console.log(`🚨 SOS from ${senderName}: ${message}`);
}