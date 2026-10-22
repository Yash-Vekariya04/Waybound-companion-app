import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FONTS, RADIUS, SPACING, FONTSIZE, SHADOW } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";

const RECENT_TRIPS = [
  { id: "1", name: "Coastal Ride",  date: "Oct 18", members: 4, duration: "2h 34m" },
  { id: "2", name: "Mountain Loop", date: "Oct 14", members: 6, duration: "4h 12m" },
  { id: "3", name: "City Cruise",   date: "Oct 10", members: 3, duration: "1h 20m" },
];

export default function HomeScreen({ navigation }) {
  const { isDark, colors } = useTheme();
  const s = makeStyles(colors);

  const [hasActiveRoom] = useState(false);

  return (
    <SafeAreaView style={s.root}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Header ── */}
        <View style={s.header}>
          <View>
            <Text style={s.greeting}>Good morning 👋</Text>
            <Text style={s.username}>Yash</Text>
          </View>
          <TouchableOpacity
            style={s.avatarCircle}
            onPress={() => navigation.navigate("Settings")}
          >
            <Text style={s.avatarText}>Y</Text>
          </TouchableOpacity>
        </View>

        {/* ── Active Room Card or No Room State ── */}
        {hasActiveRoom ? (
          <View style={[s.card, s.activeRoomCard]}>
            <View style={s.activeRoomTop}>
              <View>
                <Text style={s.activeRoomLabel}>Active Room</Text>
                <Text style={s.activeRoomName}>Coastal Ride 🚴</Text>
              </View>
              <View style={s.liveBadge}>
                <View style={s.liveDot} />
                <Text style={s.liveText}>LIVE</Text>
              </View>
            </View>
            <View style={s.activeRoomStats}>
              <View style={s.statItem}>
                <Text style={s.statValue}>5</Text>
                <Text style={s.statLabel}>Members</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.statItem}>
                <Text style={s.statValue}>12 km</Text>
                <Text style={s.statLabel}>Distance</Text>
              </View>
              <View style={s.statDivider} />
              <View style={s.statItem}>
                <Text style={s.statValue}>1h 04m</Text>
                <Text style={s.statLabel}>Duration</Text>
              </View>
            </View>
            <TouchableOpacity
              style={s.rejoinBtn}
              onPress={() => navigation.navigate("LiveTracking")}
            >
              <Text style={s.rejoinBtnText}>Rejoin Room →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[s.card, s.noRoomCard]}>
            <Text style={s.noRoomEmoji}>🗺️</Text>
            <Text style={s.noRoomTitle}>No active room</Text>
            <Text style={s.noRoomSub}>
              Create a room or join one to start tracking your ride.
            </Text>
          </View>
        )}

        {/* ── Quick Actions ── */}
        <Text style={s.sectionTitle}>Quick Actions</Text>
        <View style={s.actionsRow}>
          <TouchableOpacity
            style={[s.actionCard, s.actionCardPrimary]}
            onPress={() => navigation.navigate("CreateRoom")}
          >
            <Text style={s.actionEmoji}>➕</Text>
            <Text style={s.actionLabelPrimary}>Create Room</Text>
            <Text style={s.actionSubPrimary}>Start a new ride</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.actionCard, s.actionCardOutline]}
            onPress={() => navigation.navigate("JoinRoom")}
          >
            <Text style={s.actionEmoji}>🔗</Text>
            <Text style={s.actionLabelOutline}>Join Room</Text>
            <Text style={s.actionSubOutline}>Enter a room code</Text>
          </TouchableOpacity>
        </View>

        {/* ── Safety Alert Button ── */}
        <TouchableOpacity
          style={s.alertBtn}
          onPress={() => navigation.navigate("SafetyAlert")}
        >
          <Text style={s.alertBtnEmoji}>🚨</Text>
          <View>
            <Text style={s.alertBtnTitle}>Safety Alert</Text>
            <Text style={s.alertBtnSub}>Notify your group instantly</Text>
          </View>
          <Text style={s.alertBtnArrow}>→</Text>
        </TouchableOpacity>

        {/* ── Recent Trips ── */}
        <Text style={s.sectionTitle}>Recent Trips</Text>
        {RECENT_TRIPS.map((trip) => (
          <View key={trip.id} style={s.tripCard}>
            <View style={s.tripLeft}>
              <View style={s.tripIconCircle}>
                <Text style={s.tripIcon}>🚴</Text>
              </View>
              <View>
                <Text style={s.tripName}>{trip.name}</Text>
                <Text style={s.tripMeta}>
                  {trip.date} · {trip.members} members
                </Text>
              </View>
            </View>
            <Text style={s.tripDuration}>{trip.duration}</Text>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
  },
  username: {
    fontSize: FONTSIZE.xxl,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.sm,
  },
  avatarText: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: colors.textWhite,
  },
  card: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOW.md,
  },
  activeRoomCard: {
    backgroundColor: colors.primary,
  },
  activeRoomTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.md,
  },
  activeRoomLabel: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.regular,
    color: "rgba(255,255,255,0.75)",
  },
  activeRoomName: {
    fontSize: FONTSIZE.xl,
    fontFamily: FONTS.bold,
    color: colors.textWhite,
    marginTop: 2,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2ecc71",
  },
  liveText: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.bold,
    color: colors.textWhite,
    letterSpacing: 1,
  },
  activeRoomStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: colors.textWhite,
  },
  statLabel: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: "rgba(255,255,255,0.7)",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  rejoinBtn: {
    backgroundColor: colors.textWhite,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    alignItems: "center",
  },
  rejoinBtnText: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.bold,
    color: colors.primary,
  },
  noRoomCard: {
    backgroundColor: colors.surface,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  noRoomEmoji: {
    fontSize: 36,
    marginBottom: SPACING.sm,
  },
  noRoomTitle: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
    marginBottom: SPACING.xs,
  },
  noRoomSub: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
    marginBottom: SPACING.md,
  },
  actionsRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  actionCard: {
    flex: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    ...SHADOW.sm,
  },
  actionCardPrimary: {
    backgroundColor: colors.primary,
  },
  actionCardOutline: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  actionLabelPrimary: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.bold,
    color: colors.textWhite,
  },
  actionSubPrimary: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
  actionLabelOutline: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
  },
  actionSubOutline: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  alertBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: "#fdd",
    marginBottom: SPACING.lg,
    gap: SPACING.md,
    ...SHADOW.sm,
  },
  alertBtnEmoji: {
    fontSize: 28,
  },
  alertBtnTitle: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.bold,
    color: colors.danger,
  },
  alertBtnSub: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  alertBtnArrow: {
    marginLeft: "auto",
    fontSize: FONTSIZE.lg,
    color: colors.danger,
    fontFamily: FONTS.bold,
  },
  tripCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...SHADOW.sm,
  },
  tripLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  tripIconCircle: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center",
  },
  tripIcon: {
    fontSize: 18,
  },
  tripName: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.medium,
    color: colors.textPrimary,
  },
  tripMeta: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tripDuration: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: colors.textSecondary,
  },
});