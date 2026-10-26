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
  // Push notifications only work on real devices
  if (!Device.isDevice) {
    console.log("⚠️ Push notifications only work on real devices");
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

  // Get the Expo push token
  const tokenData = await Notifications.getExpoPushTokenAsync();
  console.log("📱 Push token:", tokenData.data);

  return tokenData.data;
}

// ── Show a local notification immediately ────────────
export async function showLocalNotification({ title, body }) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: null, // null means show immediately
  });
}

// ── Show a local SOS notification ────────────────────
export async function showSOSNotification({ senderName, message }) {
  await showLocalNotification({
    title: `🚨 SOS from ${senderName}`,
    body: message || "SOS! I need help! Open Waybound.",
  });
}