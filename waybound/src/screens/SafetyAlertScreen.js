import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, ScrollView, TextInput, Vibration
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FONTS, RADIUS, SPACING, FONTSIZE, SHADOW } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";

const ALERT_TYPES = [
  { id: "sos",       emoji: "🆘", title: "SOS Emergency",    subtitle: "Immediate help needed",        color: "#e74c3c", bg: "#fff5f5", border: "#fdd"    },
  { id: "breakdown", emoji: "🔧", title: "Breakdown",         subtitle: "Vehicle issue, need assistance",color: "#e67e22", bg: "#fff9f0", border: "#fde8cc" },
  { id: "lost",      emoji: "🗺️", title: "Lost / Separated", subtitle: "Can't find the group",         color: "#8e44ad", bg: "#fdf5ff", border: "#e8ccfd" },
  { id: "wait",      emoji: "⏸️", title: "Please Wait",       subtitle: "Need a short stop",            color: "#2980b9", bg: "#f0f8ff", border: "#cce4fd" },
  { id: "medical",   emoji: "🩺", title: "Medical Issue",     subtitle: "Someone needs medical help",   color: "#c0392b", bg: "#fff0f0", border: "#fcc"    },
  { id: "custom",    emoji: "💬", title: "Custom Message",    subtitle: "Send a custom alert",          color: "#0a8f7f", bg: "#f0faf9", border: "#b2e0db" },
];

export default function SafetyAlertScreen({ navigation }) {
  const { isDark, colors } = useTheme();
  const s = makeStyles(colors);

  const [selectedAlert, setSelectedAlert] = useState(null);
  const [customMessage, setCustomMessage] = useState("");
  const [alertSent, setAlertSent] = useState(false);

  const handleSelectAlert = (alert) => {
    setSelectedAlert(alert);
    Vibration.vibrate(80);
  };

  const handleSendAlert = () => {
    if (!selectedAlert) return;
    Vibration.vibrate([0, 100, 80, 100]);
    setAlertSent(true);
  };

  const handleReset = () => {
    setAlertSent(false);
    setSelectedAlert(null);
    setCustomMessage("");
  };

  if (alertSent) {
    return (
      <SafeAreaView style={s.root}>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={colors.background}
        />
        <View style={s.sentContainer}>
          <View style={[s.sentIconCircle, { backgroundColor: selectedAlert.bg }]}>
            <Text style={s.sentEmoji}>{selectedAlert.emoji}</Text>
          </View>
          <Text style={s.sentTitle}>Alert Sent!</Text>
          <Text style={s.sentSub}>
            Your group has been notified with a{"\n"}
            <Text style={[s.sentAlertName, { color: selectedAlert.color }]}>
              {selectedAlert.title}
            </Text>
            {" "}alert.
          </Text>
          {customMessage.trim() !== "" && (
            <View style={s.sentMessageCard}>
              <Text style={s.sentMessageLabel}>Your message</Text>
              <Text style={s.sentMessageText}>"{customMessage}"</Text>
            </View>
          )}
          <View style={s.sentInfoCard}>
            <Text style={s.sentInfoRow}>📍 Your location was shared</Text>
            <Text style={s.sentInfoRow}>🔔 All members notified</Text>
            <Text style={s.sentInfoRow}>⏱️ Alert active until dismissed</Text>
          </View>
          <TouchableOpacity
            style={s.backToMapBtn}
            onPress={() => { handleReset(); navigation.navigate("LiveTracking"); }}
          >
            <Text style={s.backToMapBtnText}>Back to Map →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.cancelAlertBtn} onPress={handleReset}>
            <Text style={s.cancelAlertBtnText}>Cancel Alert</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Text style={s.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={s.topBarTitle}>Safety Alert</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >

        <View style={s.headerSection}>
          <Text style={s.headerEmoji}>🚨</Text>
          <Text style={s.headerTitle}>Send an Alert</Text>
          <Text style={s.headerSub}>
            Choose the type of alert to notify your entire group instantly.
          </Text>
        </View>

        <Text style={s.sectionLabel}>Alert Type</Text>
        <View style={s.alertGrid}>
          {ALERT_TYPES.map((alert) => (
            <TouchableOpacity
              key={alert.id}
              style={[
                s.alertCard,
                { backgroundColor: alert.bg, borderColor: alert.border },
                selectedAlert?.id === alert.id && s.alertCardSelected,
                selectedAlert?.id === alert.id && { borderColor: alert.color },
              ]}
              onPress={() => handleSelectAlert(alert)}
              activeOpacity={0.8}
            >
              <Text style={s.alertCardEmoji}>{alert.emoji}</Text>
              <Text style={[s.alertCardTitle, { color: alert.color }]}>
                {alert.title}
              </Text>
              <Text style={s.alertCardSub}>{alert.subtitle}</Text>
              {selectedAlert?.id === alert.id && (
                <View style={[s.selectedTick, { backgroundColor: alert.color }]}>
                  <Text style={s.selectedTickText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {selectedAlert?.id === "custom" && (
          <View style={s.customMessageWrapper}>
            <Text style={s.sectionLabel}>Your Message</Text>
            <TextInput
              style={s.customInput}
              placeholder="Type your alert message here..."
              placeholderTextColor={colors.textMuted}
              value={customMessage}
              onChangeText={setCustomMessage}
              multiline
              maxLength={120}
            />
            <Text style={s.charCount}>{customMessage.length}/120</Text>
          </View>
        )}

        <View style={s.notifyCard}>
          <Text style={s.notifyTitle}>🔔 Who gets notified?</Text>
          <Text style={s.notifyText}>
            All members currently in your room will receive a push notification
            and see your alert on their map instantly.
          </Text>
        </View>

        <TouchableOpacity
          style={[
            s.sendBtn,
            !selectedAlert && s.sendBtnDisabled,
            selectedAlert && { backgroundColor: selectedAlert.color },
          ]}
          onPress={handleSendAlert}
          disabled={!selectedAlert}
        >
          <Text style={s.sendBtnText}>
            {selectedAlert
              ? `Send ${selectedAlert.emoji} ${selectedAlert.title}`
              : "Select an Alert Type First"}
          </Text>
        </TouchableOpacity>

        {selectedAlert && (
          <TouchableOpacity style={s.clearBtn} onPress={() => setSelectedAlert(null)}>
            <Text style={s.clearBtnText}>Clear Selection</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
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
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  headerEmoji: { fontSize: 44, marginBottom: SPACING.sm },
  headerTitle: {
    fontSize: FONTSIZE.xxl,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
  },
  headerSub: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  sectionLabel: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: colors.textSecondary,
    marginBottom: SPACING.sm,
  },
  alertGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  alertCard: {
    width: "47.5%",
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    padding: SPACING.md,
    position: "relative",
    ...SHADOW.sm,
  },
  alertCardSelected: {
    borderWidth: 2,
    ...SHADOW.md,
  },
  alertCardEmoji: { fontSize: 28, marginBottom: SPACING.xs },
  alertCardTitle: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.bold,
    marginBottom: 2,
  },
  alertCardSub: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  selectedTick: {
    position: "absolute",
    top: SPACING.sm,
    right: SPACING.sm,
    width: 20,
    height: 20,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedTickText: {
    fontSize: FONTSIZE.xs,
    color: colors.textWhite,
    fontFamily: FONTS.bold,
  },
  customMessageWrapper: { marginBottom: SPACING.lg },
  customInput: {
    backgroundColor: colors.inputBg,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.regular,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 90,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: colors.textMuted,
    textAlign: "right",
    marginTop: 4,
  },
  notifyCard: {
    backgroundColor: colors.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: SPACING.lg,
    ...SHADOW.sm,
  },
  notifyTitle: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
  },
  notifyText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  sendBtn: {
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginBottom: SPACING.sm,
    ...SHADOW.md,
  },
  sendBtnDisabled: { backgroundColor: colors.border },
  sendBtnText: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: colors.textWhite,
  },
  clearBtn: { alignItems: "center", paddingVertical: SPACING.sm },
  clearBtnText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: colors.textSecondary,
  },
  sentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: SPACING.xl,
  },
  sentIconCircle: {
    width: 90,
    height: 90,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.lg,
    ...SHADOW.md,
  },
  sentEmoji: { fontSize: 44 },
  sentTitle: {
    fontSize: FONTSIZE.huge,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
    marginBottom: SPACING.sm,
  },
  sentSub: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  sentAlertName: { fontFamily: FONTS.bold },
  sentMessageCard: {
    backgroundColor: colors.inputBg,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    width: "100%",
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sentMessageLabel: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.medium,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  sentMessageText: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.regular,
    color: colors.textPrimary,
    fontStyle: "italic",
  },
  sentInfoCard: {
    backgroundColor: colors.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    width: "100%",
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: colors.border,
    gap: SPACING.sm,
    ...SHADOW.sm,
  },
  sentInfoRow: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
  },
  backToMapBtn: {
    backgroundColor: colors.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    width: "100%",
    alignItems: "center",
    marginBottom: SPACING.sm,
    ...SHADOW.md,
  },
  backToMapBtnText: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: colors.textWhite,
  },
  cancelAlertBtn: { paddingVertical: SPACING.sm, alignItems: "center" },
  cancelAlertBtnText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: colors.danger,
  },
});