import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

// ── How notifications appear when app is open ────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// ── Register device and get push token ───────────────
export async function registerForPushNotifications() {
  try {
    // Push notifications only work on real devices
    if (!Device.isDevice) {
      console.log("⚠️ Not a real device");
      return null;
    }

    // Check existing permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Ask for permission if not already granted
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("⚠️ Push notification permission denied");
      return null;
    }

    // Safely try to get push token
    // This may fail in Expo Go — that's okay
    try {
      const tokenData = await Notifications.getExpoPushTokenAsync();
      console.log("📱 Push token:", tokenData.data);
      return tokenData.data;
    } catch (tokenError) {
      // Expo Go doesn't support remote push tokens
      // Local notifications still work fine
      console.log("ℹ️ Remote push tokens not supported in Expo Go:", tokenError.message);
      return null;
    }

  } catch (error) {
    console.log("ℹ️ Push notification setup skipped:", error.message);
    return null;
  }
}

// ── Show a local notification immediately ────────────
export async function showLocalNotification({ title, body }) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null, // null means show immediately
    });
  } catch (error) {
    console.log("Local notification error:", error.message);
  }
}

// ── Show a local SOS notification ────────────────────
export async function showSOSNotification({ senderName, message }) {
  await showLocalNotification({
    title: `🚨 SOS from ${senderName}`,
    body: message || "SOS! I need help! Open Waybound.",
  });
}