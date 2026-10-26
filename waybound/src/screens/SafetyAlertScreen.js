import React from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FONTS, RADIUS, SPACING, FONTSIZE, SHADOW } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";
import { getSocket } from "../services/socket";

export default function SafetyAlertScreen({ navigation, route }) {
  const { isDark, colors } = useTheme();
  const s = makeStyles(colors);

  // These come from LiveTrackingScreen when it navigates here
  const room = route.params?.room;
  const myLocation = route.params?.myLocation;

  function handleSendSOS() {
    const socket = getSocket();

    if (!socket || !socket.connected) {
      Alert.alert("Not connected", "You are not connected to a room.");
      return;
    }

    socket.emit("safety_alert", {
      roomCode: room.code,
      latitude: myLocation?.latitude,
      longitude: myLocation?.longitude,
      message: "SOS! I need help!",
    });

    Alert.alert(
      "🚨 SOS Sent",
      "Your group has been alerted.",
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  }

  return (
    <SafeAreaView style={s.root}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      {/* ── Top Bar ── */}
      <View style={s.topBar}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={s.topBarTitle}>Safety Alert</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={s.container}>

        {/* ── Warning Icon ── */}
        <View style={s.iconCircle}>
          <Text style={s.iconText}>🚨</Text>
        </View>

        {/* ── Title ── */}
        <Text style={s.title}>Send SOS Alert</Text>
        <Text style={s.subtitle}>
          This will immediately notify all members in your room with your current location.
        </Text>

        {/* ── Room Info ── */}
        {room && (
          <View style={s.infoCard}>
            <Text style={s.infoLabel}>Room</Text>
            <Text style={s.infoValue}>{room.icon} {room.name}</Text>
            <Text style={s.infoCode}>{room.code}</Text>
          </View>
        )}

        {/* ── Location Info ── */}
        <View style={s.infoCard}>
          <Text style={s.infoLabel}>Your Location</Text>
          {myLocation ? (
            <Text style={s.infoValue}>
              {myLocation.latitude.toFixed(5)}, {myLocation.longitude.toFixed(5)}
            </Text>
          ) : (
            <Text style={s.infoValue}>📍 Fetching location...</Text>
          )}
        </View>

        {/* ── SOS Button ── */}
        <TouchableOpacity style={s.sosBtn} onPress={handleSendSOS}>
          <Text style={s.sosBtnText}>🚨 Send SOS Now</Text>
        </TouchableOpacity>

        {/* ── Cancel ── */}
        <TouchableOpacity
          style={s.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={s.cancelBtnText}>Cancel</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.background,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: FONTSIZE.xl,
    color: colors.textPrimary,
    fontFamily: FONTS.medium,
  },
  topBarTitle: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
  },
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    alignItems: "center",
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFEBEE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
  },
  iconText: {
    fontSize: 48,
  },
  title: {
    fontSize: FONTSIZE.xxl,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  infoCard: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: SPACING.md,
  },
  infoLabel: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.medium,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
  },
  infoCode: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sosBtn: {
    width: "100%",
    backgroundColor: "#E53935",
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginTop: SPACING.md,
    ...SHADOW.md,
  },
  sosBtnText: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: "#fff",
  },
  cancelBtn: {
    width: "100%",
    backgroundColor: colors.inputBg,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelBtnText: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.medium,
    color: colors.textSecondary,
  },
});