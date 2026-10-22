import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, ScrollView, Linking
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FONTS, RADIUS, SPACING, FONTSIZE, SHADOW } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";

const FALLBACK_MEMBER = {
  id: "1",
  name: "Unknown Member",
  initials: "?",
  color: "#0a8f7f",
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

const StatCard = ({ emoji, label, value, colors }) => (
  <View style={makeStyles(colors).statCard}>
    <Text style={makeStyles(colors).statEmoji}>{emoji}</Text>
    <Text style={makeStyles(colors).statValue}>{value}</Text>
    <Text style={makeStyles(colors).statLabel}>{label}</Text>
  </View>
);

export default function MemberDetailScreen({ navigation, route }) {
  const { isDark, colors } = useTheme();
  const s = makeStyles(colors);

  const passed = route.params?.member ?? {};
  const [member] = useState({
    ...FALLBACK_MEMBER,
    ...passed,
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

  const handleCall = () => Linking.openURL(`tel:${member.phone}`);

  const handlePing = () => {
    setMessageSent(true);
    setTimeout(() => setMessageSent(false), 3000);
  };

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
        <Text style={s.topBarTitle}>Member Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Profile Card ── */}
        <View style={s.profileCard}>
          <View style={[s.avatarCircle, { backgroundColor: member.color }]}>
            <Text style={s.avatarText}>{member.initials}</Text>
          </View>
          <Text style={s.memberName}>{member.name}</Text>
          <Text style={s.memberPhone}>{member.phone}</Text>

          <View style={[
            s.statusBadge,
            member.status === "moving" ? s.statusMoving : s.statusStopped,
          ]}>
            <View style={[
              s.statusDot,
              member.status === "moving" ? s.statusDotMoving : s.statusDotStopped,
            ]} />
            <Text style={[
              s.statusText,
              member.status === "moving" ? s.statusTextMoving : s.statusTextStopped,
            ]}>
              {member.status === "moving" ? "Moving" : "Stopped"}
            </Text>
          </View>

          {messageSent && (
            <View style={s.pingSuccess}>
              <Text style={s.pingSuccessText}>
                👋 Ping sent to {member.name.split(" ")[0]}!
              </Text>
            </View>
          )}

          <View style={s.actionRow}>
            <TouchableOpacity style={[s.actionBtn, s.actionBtnPrimary]} onPress={handlePing}>
              <Text style={s.actionBtnEmoji}>👋</Text>
              <Text style={s.actionBtnTextPrimary}>Ping</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.actionBtn, s.actionBtnOutline]} onPress={handleCall}>
              <Text style={s.actionBtnEmoji}>📞</Text>
              <Text style={s.actionBtnTextOutline}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.actionBtn, s.actionBtnDanger]}
              onPress={() => navigation.navigate("SafetyAlert")}
            >
              <Text style={s.actionBtnEmoji}>🚨</Text>
              <Text style={s.actionBtnTextDanger}>Alert</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Live Stats Grid ── */}
        <Text style={s.sectionLabel}>Live Stats</Text>
        <View style={s.statsGrid}>
          <StatCard emoji="🏎️" label="Speed"        value={member.speed}           colors={colors} />
          <StatCard emoji="🧭" label="Heading"      value={member.heading}         colors={colors} />
          <StatCard emoji="📍" label="Distance"     value={member.distanceFromYou} colors={colors} />
          <StatCard emoji="⛰️" label="Altitude"     value={member.altitude}        colors={colors} />
          <StatCard emoji="🎯" label="GPS Accuracy" value={member.accuracy}        colors={colors} />
          <StatCard emoji="🔋" label="Battery"      value={member.batteryLevel}    colors={colors} />
        </View>

        {/* ── Trip Info ── */}
        <Text style={s.sectionLabel}>Trip Info</Text>
        <View style={s.infoCard}>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>⏱️  Joined ride</Text>
            <Text style={s.infoValue}>{member.joinedAt}</Text>
          </View>
          <View style={s.infoDivider} />
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>🛣️  Total distance</Text>
            <Text style={s.infoValue}>{member.totalDistance}</Text>
          </View>
          <View style={s.infoDivider} />
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>🕐  Last seen</Text>
            <Text style={s.infoValue}>{member.lastSeen}</Text>
          </View>
        </View>

        {/* ── Focus on Map ── */}
        <TouchableOpacity
          style={s.focusBtn}
          onPress={() => navigation.navigate("LiveTracking")}
        >
          <Text style={s.focusBtnText}>🗺️  Focus on Map</Text>
        </TouchableOpacity>

        {/* ── Remove From Room ── */}
        <TouchableOpacity style={s.removeBtn}>
          <Text style={s.removeBtnText}>Remove from Room</Text>
        </TouchableOpacity>

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
  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    alignItems: "center",
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: colors.border,
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
    color: colors.textWhite,
  },
  memberName: {
    fontSize: FONTSIZE.xl,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
  },
  memberPhone: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
    marginBottom: SPACING.md,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  statusMoving:  { backgroundColor: "rgba(46,204,113,0.12)" },
  statusStopped: { backgroundColor: "rgba(231,76,60,0.1)"   },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: RADIUS.full,
  },
  statusDotMoving:  { backgroundColor: "#2ecc71" },
  statusDotStopped: { backgroundColor: "#e74c3c" },
  statusText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
  },
  statusTextMoving:  { color: "#2ecc71" },
  statusTextStopped: { color: "#e74c3c" },
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
    color: "#0a8f7f",
  },
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
    backgroundColor: colors.primary,
    ...SHADOW.sm,
  },
  actionBtnOutline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...SHADOW.sm,
  },
  actionBtnDanger: {
    backgroundColor: "#fff5f5",
    borderWidth: 1,
    borderColor: "#fdd",
  },
  actionBtnEmoji: { fontSize: 20 },
  actionBtnTextPrimary: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.bold,
    color: colors.textWhite,
  },
  actionBtnTextOutline: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
  },
  actionBtnTextDanger: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.bold,
    color: "#e74c3c",
  },
  sectionLabel: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: colors.textSecondary,
    marginBottom: SPACING.sm,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statCard: {
    width: "31%",
    backgroundColor: colors.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    ...SHADOW.sm,
  },
  statEmoji: { fontSize: 22, marginBottom: SPACING.xs },
  statValue: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
    textAlign: "center",
  },
  statLabel: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
    marginTop: 2,
    textAlign: "center",
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: colors.border,
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
    backgroundColor: colors.border,
  },
  infoLabel: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.medium,
    color: colors.textPrimary,
  },
  focusBtn: {
    backgroundColor: colors.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginBottom: SPACING.sm,
    ...SHADOW.md,
  },
  focusBtnText: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: colors.textWhite,
  },
  removeBtn: {
    alignItems: "center",
    paddingVertical: SPACING.sm,
  },
  removeBtnText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: colors.danger,
  },
});