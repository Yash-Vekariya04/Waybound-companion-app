import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, ScrollView, TextInput, Vibration
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS, RADIUS, SPACING, FONTSIZE, SHADOW } from "../constants/theme";

const ALERT_TYPES = [
  {
    id: "sos",
    emoji: "🆘",
    title: "SOS Emergency",
    subtitle: "Immediate help needed",
    color: "#e74c3c",
    bg: "#fff5f5",
    border: "#fdd",
  },
  {
    id: "breakdown",
    emoji: "🔧",
    title: "Breakdown",
    subtitle: "Vehicle issue, need assistance",
    color: "#e67e22",
    bg: "#fff9f0",
    border: "#fde8cc",
  },
  {
    id: "lost",
    emoji: "🗺️",
    title: "Lost / Separated",
    subtitle: "Can't find the group",
    color: "#8e44ad",
    bg: "#fdf5ff",
    border: "#e8ccfd",
  },
  {
    id: "wait",
    emoji: "⏸️",
    title: "Please Wait",
    subtitle: "Need a short stop",
    color: "#2980b9",
    bg: "#f0f8ff",
    border: "#cce4fd",
  },
  {
    id: "medical",
    emoji: "🩺",
    title: "Medical Issue",
    subtitle: "Someone needs medical help",
    color: "#c0392b",
    bg: "#fff0f0",
    border: "#fcc",
  },
  {
    id: "custom",
    emoji: "💬",
    title: "Custom Message",
    subtitle: "Send a custom alert",
    color: COLORS.primary,
    bg: "#f0faf9",
    border: "#b2e0db",
  },
];

export default function SafetyAlertScreen({ navigation }) {
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

  // ── Alert Sent Confirmation Screen ──
  if (alertSent) {
    return (
      <SafeAreaView style={styles.root}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <View style={styles.sentContainer}>

          <View style={[styles.sentIconCircle, { backgroundColor: selectedAlert.bg }]}>
            <Text style={styles.sentEmoji}>{selectedAlert.emoji}</Text>
          </View>

          <Text style={styles.sentTitle}>Alert Sent!</Text>
          <Text style={styles.sentSub}>
            Your group has been notified with a{"\n"}
            <Text style={[styles.sentAlertName, { color: selectedAlert.color }]}>
              {selectedAlert.title}
            </Text>
            {" "}alert.
          </Text>

          {customMessage.trim() !== "" && (
            <View style={styles.sentMessageCard}>
              <Text style={styles.sentMessageLabel}>Your message</Text>
              <Text style={styles.sentMessageText}>"{customMessage}"</Text>
            </View>
          )}

          <View style={styles.sentInfoCard}>
            <Text style={styles.sentInfoRow}>📍 Your location was shared</Text>
            <Text style={styles.sentInfoRow}>🔔 All members notified</Text>
            <Text style={styles.sentInfoRow}>⏱️ Alert active until dismissed</Text>
          </View>

          <TouchableOpacity
            style={styles.backToMapBtn}
            onPress={() => {
              handleReset();
              navigation.navigate("LiveTracking");
            }}
          >
            <Text style={styles.backToMapBtnText}>Back to Map →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelAlertBtn}
            onPress={handleReset}
          >
            <Text style={styles.cancelAlertBtnText}>Cancel Alert</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    );
  }

  // ── Alert Selection Screen ──
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Safety Alert</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Header ── */}
        <View style={styles.headerSection}>
          <Text style={styles.headerEmoji}>🚨</Text>
          <Text style={styles.headerTitle}>Send an Alert</Text>
          <Text style={styles.headerSub}>
            Choose the type of alert to notify your entire group instantly.
          </Text>
        </View>

        {/* ── Alert Type Grid ── */}
        <Text style={styles.sectionLabel}>Alert Type</Text>
        <View style={styles.alertGrid}>
          {ALERT_TYPES.map((alert) => (
            <TouchableOpacity
              key={alert.id}
              style={[
                styles.alertCard,
                { backgroundColor: alert.bg, borderColor: alert.border },
                selectedAlert?.id === alert.id && styles.alertCardSelected,
                selectedAlert?.id === alert.id && { borderColor: alert.color },
              ]}
              onPress={() => handleSelectAlert(alert)}
              activeOpacity={0.8}
            >
              <Text style={styles.alertCardEmoji}>{alert.emoji}</Text>
              <Text style={[styles.alertCardTitle, { color: alert.color }]}>
                {alert.title}
              </Text>
              <Text style={styles.alertCardSub}>{alert.subtitle}</Text>
              {selectedAlert?.id === alert.id && (
                <View style={[styles.selectedTick, { backgroundColor: alert.color }]}>
                  <Text style={styles.selectedTickText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Custom Message (only for custom type) ── */}
        {selectedAlert?.id === "custom" && (
          <View style={styles.customMessageWrapper}>
            <Text style={styles.sectionLabel}>Your Message</Text>
            <TextInput
              style={styles.customInput}
              placeholder="Type your alert message here..."
              placeholderTextColor={COLORS.textMuted}
              value={customMessage}
              onChangeText={setCustomMessage}
              multiline
              maxLength={120}
            />
            <Text style={styles.charCount}>{customMessage.length}/120</Text>
          </View>
        )}

        {/* ── Who Gets Notified ── */}
        <View style={styles.notifyCard}>
          <Text style={styles.notifyTitle}>🔔 Who gets notified?</Text>
          <Text style={styles.notifyText}>
            All members currently in your room will receive a push notification and see your alert on their map instantly.
          </Text>
        </View>

        {/* ── Send Button ── */}
        <TouchableOpacity
          style={[
            styles.sendBtn,
            !selectedAlert && styles.sendBtnDisabled,
            selectedAlert && { backgroundColor: selectedAlert.color },
          ]}
          onPress={handleSendAlert}
          disabled={!selectedAlert}
        >
          <Text style={styles.sendBtnText}>
            {selectedAlert
              ? `Send ${selectedAlert.emoji} ${selectedAlert.title}`
              : "Select an Alert Type First"}
          </Text>
        </TouchableOpacity>

        {selectedAlert && (
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={() => setSelectedAlert(null)}
          >
            <Text style={styles.clearBtnText}>Clear Selection</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Top Bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.inputBg,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    fontSize: FONTSIZE.xl,
    color: COLORS.textPrimary,
    fontFamily: FONTS.medium,
  },
  topBarTitle: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },

  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },

  // Header
  headerSection: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  headerEmoji: {
    fontSize: 44,
    marginBottom: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONTSIZE.xxl,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  headerSub: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },

  // Section Label
  sectionLabel: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },

  // Alert Grid
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
  alertCardEmoji: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  alertCardTitle: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.bold,
    marginBottom: 2,
  },
  alertCardSub: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
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
    color: COLORS.textWhite,
    fontFamily: FONTS.bold,
  },

  // Custom Message
  customMessageWrapper: {
    marginBottom: SPACING.lg,
  },
  customInput: {
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 90,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    textAlign: "right",
    marginTop: 4,
  },

  // Notify Card
  notifyCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    ...SHADOW.sm,
  },
  notifyTitle: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  notifyText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },

  // Send Button
  sendBtn: {
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginBottom: SPACING.sm,
    ...SHADOW.md,
  },
  sendBtnDisabled: {
    backgroundColor: COLORS.border,
  },
  sendBtnText: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
  },
  clearBtn: {
    alignItems: "center",
    paddingVertical: SPACING.sm,
  },
  clearBtnText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },

  // Sent Confirmation Screen
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
  sentEmoji: {
    fontSize: 44,
  },
  sentTitle: {
    fontSize: FONTSIZE.huge,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  sentSub: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  sentAlertName: {
    fontFamily: FONTS.bold,
  },
  sentMessageCard: {
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    width: "100%",
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sentMessageLabel: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  sentMessageText: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    fontStyle: "italic",
  },
  sentInfoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    width: "100%",
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.sm,
    ...SHADOW.sm,
  },
  sentInfoRow: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  backToMapBtn: {
    backgroundColor: COLORS.primary,
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
    color: COLORS.textWhite,
  },
  cancelAlertBtn: {
    paddingVertical: SPACING.sm,
    alignItems: "center",
  },
  cancelAlertBtnText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.danger,
  },
});