const { Expo } = require("expo-server-sdk");

const expo = new Expo();

// ── Send push notification to multiple tokens ────────
async function sendPushNotification({ tokens, title, body }) {
  // Filter valid tokens only
  const validTokens = tokens.filter(
    (token) => token && Expo.isExpoPushToken(token)
  );

  if (validTokens.length === 0) return;

  // Build messages
  const messages = validTokens.map((token) => ({
    to: token,
    sound: "default",
    title,
    body,
    data: { type: "safety_alert" },
    priority: "high",
  }));

  // Send in chunks
  const chunks = expo.chunkPushNotifications(messages);

  for (const chunk of chunks) {
    try {
      const receipts = await expo.sendPushNotificationsAsync(chunk);
      console.log("📨 Push notification sent:", receipts);
    } catch (error) {
      console.error("Push notification error:", error.message);
    }
  }
}

module.exports = { sendPushNotification };