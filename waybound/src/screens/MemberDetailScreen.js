import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, ScrollView, Linking
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS, RADIUS, SPACING, FONTSIZE, SHADOW } from "../constants/theme";

// Mock member data — will come from Socket.io in backend phase
const FALLBACK_MEMBER = {
  id: "1",
  name: "Unknown Member",
  initials: "?",
  color: COLORS.primary,
  phone: "—",
  status: "moving",
  speed: "—",
  heading: "—",
  altitude: "—",
  accuracy: "—",
  distanceFromYou: "—",
  lastSeen: "Just now",
  batteryLevel: "—",
  joinedAt: "—",
  totalDistance: "—",
};

const StatCard = ({ emoji, label, value }) => (
  <View style={styles.statCard}>
    <Text style={styles.statEmoji}>{emoji}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function MemberDetailScreen({ navigation, route }) {
  const passed = route.params?.member ?? {};
  const [member] = useState({
    ...FALLBACK_MEMBER,
    ...passed,
    // Fields not in live data yet — show placeholder
    phone:           passed.phone           ?? "—",
    heading:         passed.heading         ?? "—",
    altitude:        passed.altitude        ?? "—",
    accuracy:        passed.accuracy        ?? "—",
    distanceFromYou: passed.distanceFromYou ?? "—",
    batteryLevel:    passed.batteryLevel    ?? "—",
    joinedAt:        passed.joinedAt        ?? "—",
    totalDistance:   passed.totalDistance   ?? "—",
    lastSeen:        passed.lastSeen        ?? "Just now",
  });

  const [messageSent, setMessageSent] = useState(false);

  const handleCall = () => {
    Linking.openURL(`tel:${member.phone}`);
  };

  const handlePing = () => {
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 3000);
  };

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
        <Text style={styles.topBarTitle}>Member Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Profile Card ── */}
        <View style={styles.profileCard}>
          <View style={[styles.avatarCircle, { backgroundColor: member.color }]}>
            <Text style={styles.avatarText}>{member.initials}</Text>
          </View>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.memberPhone}>{member.phone}</Text>

          {/* Status Badge */}
          <View style={[
            styles.statusBadge,
            member.status === "moving"
              ? styles.statusMoving
              : styles.statusStopped
          ]}>
            <View style={[
              styles.statusDot,
              member.status === "moving"
                ? styles.statusDotMoving
                : styles.statusDotStopped
            ]} />
            <Text style={[
              styles.statusText,
              member.status === "moving"
                ? styles.statusTextMoving
                : styles.statusTextStopped
            ]}>
              {member.status === "moving" ? "Moving" : "Stopped"}
            </Text>
          </View>

          {/* Ping Success Message */}
          {messageSent && (
            <View style={styles.pingSuccess}>
              <Text style={styles.pingSuccessText}>
                👋 Ping sent to {member.name.split(" ")[0]}!
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnPrimary]}
              onPress={handlePing}
            >
              <Text style={styles.actionBtnEmoji}>👋</Text>
              <Text style={styles.actionBtnTextPrimary}>Ping</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnOutline]}
              onPress={handleCall}
            >
              <Text style={styles.actionBtnEmoji}>📞</Text>
              <Text style={styles.actionBtnTextOutline}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnDanger]}
              onPress={() => navigation.navigate("SafetyAlert")}
            >
              <Text style={styles.actionBtnEmoji}>🚨</Text>
              <Text style={styles.actionBtnTextDanger}>Alert</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Live Stats Grid ── */}
        <Text style={styles.sectionLabel}>Live Stats</Text>
        <View style={styles.statsGrid}>
          <StatCard emoji="🏎️" label="Speed"         value={member.speed} />
          <StatCard emoji="🧭" label="Heading"       value={member.heading} />
          <StatCard emoji="📍" label="Distance"      value={member.distanceFromYou} />
          <StatCard emoji="⛰️" label="Altitude"      value={member.altitude} />
          <StatCard emoji="🎯" label="GPS Accuracy"  value={member.accuracy} />
          <StatCard emoji="🔋" label="Battery"       value={member.batteryLevel} />
        </View>

        {/* ── Trip Info ── */}
        <Text style={styles.sectionLabel}>Trip Info</Text>
        <View style={styles.infoCard}>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>⏱️  Joined ride</Text>
            <Text style={styles.infoValue}>{member.joinedAt}</Text>
          </View>
          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🛣️  Total distance</Text>
            <Text style={styles.infoValue}>{member.totalDistance}</Text>
          </View>
          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>🕐  Last seen</Text>
            <Text style={styles.infoValue}>{member.lastSeen}</Text>
          </View>

        </View>

        {/* ── Focus on Map Button ── */}
        <TouchableOpacity
          style={styles.focusBtn}
          onPress={() => navigation.navigate("LiveTracking")}
        >
          <Text style={styles.focusBtnText}>🗺️  Focus on Map</Text>
        </TouchableOpacity>

        {/* ── Remove From Room ── */}
        <TouchableOpacity style={styles.removeBtn}>
          <Text style={styles.removeBtnText}>Remove from Room</Text>
        </TouchableOpacity>

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

  // Profile Card
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: "center",
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.md,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
    ...SHADOW.sm,
  },
  avatarText: {
    fontSize: FONTSIZE.xxl,
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
  },
  memberName: {
    fontSize: FONTSIZE.xl,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  memberPhone: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },

  // Status Badge
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  statusMoving: {
    backgroundColor: "rgba(46,204,113,0.12)",
  },
  statusStopped: {
    backgroundColor: "rgba(231,76,60,0.1)",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: RADIUS.full,
  },
  statusDotMoving: {
    backgroundColor: COLORS.secondary,
  },
  statusDotStopped: {
    backgroundColor: COLORS.danger,
  },
  statusText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
  },
  statusTextMoving: {
    color: COLORS.secondary,
  },
  statusTextStopped: {
    color: COLORS.danger,
  },

  // Ping Success
  pingSuccess: {
    backgroundColor: "#f0faf9",
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: "#b2e0db",
  },
  pingSuccessText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },

  // Action Buttons
  actionRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    width: "100%",
  },
  actionBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    gap: 4,
  },
  actionBtnPrimary: {
    backgroundColor: COLORS.primary,
    ...SHADOW.sm,
  },
  actionBtnOutline: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  actionBtnDanger: {
    backgroundColor: "#fff5f5",
    borderWidth: 1,
    borderColor: "#fdd",
  },
  actionBtnEmoji: {
    fontSize: 20,
  },
  actionBtnTextPrimary: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
  },
  actionBtnTextOutline: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  actionBtnTextDanger: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.danger,
  },

  // Section Label
  sectionLabel: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statCard: {
    width: "31%",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  statEmoji: {
    fontSize: 22,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    textAlign: "center",
  },
  statLabel: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: "center",
  },

  // Info Card
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.lg,
    ...SHADOW.sm,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
  },
  infoDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  infoLabel: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  infoValue: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },

  // Focus Button
  focusBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginBottom: SPACING.sm,
    ...SHADOW.md,
  },
  focusBtnText: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
  },

  // Remove Button
  removeBtn: {
    alignItems: "center",
    paddingVertical: SPACING.sm,
  },
  removeBtnText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.danger,
  },
});