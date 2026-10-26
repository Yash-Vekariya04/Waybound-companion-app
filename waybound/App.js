import "react-native-get-random-values";
import React, { useEffect, useRef } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import { ThemeProvider } from "./src/context/ThemeContext";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";

// ── How notifications appear when app is open ────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    let notificationListener;
    let responseListener;

    try {
      // When a notification is received while app is open
      notificationListener = Notifications.addNotificationReceivedListener(
        (notification) => {
          console.log("🔔 Notification received:", notification);
        },
      );

      // When user taps the notification
      responseListener = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          console.log("👆 Notification tapped:", response);
        },
      );
    } catch (error) {
      console.log("ℹ️ Notification listeners skipped:", error.message);
    }

    return () => {
      try {
        if (notificationListener) {
          Notifications.removeNotificationSubscription(notificationListener);
        }
        if (responseListener) {
          Notifications.removeNotificationSubscription(responseListener);
        }
      } catch (error) {
        console.log("ℹ️ Notification cleanup skipped:", error.message);
      }
    };
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
