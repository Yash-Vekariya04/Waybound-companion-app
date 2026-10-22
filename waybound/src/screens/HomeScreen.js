import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, SafeAreaView
} from "react-native";
import { COLORS, FONTS, RADIUS, SPACING, FONTSIZE, SHADOW } from "../constants/theme";

const RECENT_TRIPS = [
  { id: "1", name: "Coastal Ride", date: "Oct 18", members: 4, duration: "2h 34m" },
  { id: "2", name: "Mountain Loop", date: "Oct 14", members: 6, duration: "4h 12m" },
  { id: "3", name: "City Cruise", date: "Oct 10", members: 3, duration: "1h 20m" },
];

export default function HomeScreen({ navigation }) {
  const [hasActiveRoom] = useState(false);

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.username}>Yash</Text>
          </View>
          <TouchableOpacity
            style={styles.avatarCircle}
            onPress={() => navigation.navigate("Settings")}
          >
            <Text style={styles.avatarText}>Y</Text>
          </TouchableOpacity>
        </View>

        {/* ── Active Room Card or No Room State ── */}
        {hasActiveRoom ? (
          <View style={[styles.card, styles.activeRoomCard]}>
            <View style={styles.activeRoomTop}>
              <View>
                <Text style={styles.activeRoomLabel}>Active Room</Text>
                <Text style={styles.activeRoomName}>Coastal Ride 🚴</Text>
              </View>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
            <View style={styles.activeRoomStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>Members</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12 km</Text>
                <Text style={styles.statLabel}>Distance</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>1h 04m</Text>
                <Text style={styles.statLabel}>Duration</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.rejoinBtn}
              onPress={() => navigation.navigate("LiveTracking")}
            >
              <Text style={styles.rejoinBtnText}>Rejoin Room →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[styles.card, styles.noRoomCard]}>
            <Text style={styles.noRoomEmoji}>🗺️</Text>
            <Text style={styles.noRoomTitle}>No active room</Text>
            <Text style={styles.noRoomSub}>
              Create a room or join one to start tracking your ride.
            </Text>
          </View>
        )}

        {/* ── Quick Actions ── */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionCard, styles.actionCardPrimary]}
            onPress={() => navigation.navigate("CreateRoom")}
          >
            <Text style={styles.actionEmoji}>➕</Text>
            <Text style={styles.actionLabelPrimary}>Create Room</Text>
            <Text style={styles.actionSubPrimary}>Start a new ride</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, styles.actionCardOutline]}
            onPress={() => navigation.navigate("JoinRoom")}
          >
            <Text style={styles.actionEmoji}>🔗</Text>
            <Text style={styles.actionLabelOutline}>Join Room</Text>
            <Text style={styles.actionSubOutline}>Enter a room code</Text>
          </TouchableOpacity>
        </View>

        {/* ── Safety Alert Button ── */}
        <TouchableOpacity
          style={styles.alertBtn}
          onPress={() => navigation.navigate("SafetyAlert")}
        >
          <Text style={styles.alertBtnEmoji}>🚨</Text>
          <View>
            <Text style={styles.alertBtnTitle}>Safety Alert</Text>
            <Text style={styles.alertBtnSub}>Notify your group instantly</Text>
          </View>
          <Text style={styles.alertBtnArrow}>→</Text>
        </TouchableOpacity>

        {/* ── Recent Trips ── */}
        <Text style={styles.sectionTitle}>Recent Trips</Text>

        {RECENT_TRIPS.map((trip) => (
          <View key={trip.id} style={styles.tripCard}>
            <View style={styles.tripLeft}>
              <View style={styles.tripIconCircle}>
                <Text style={styles.tripIcon}>🚴</Text>
              </View>
              <View>
                <Text style={styles.tripName}>{trip.name}</Text>
                <Text style={styles.tripMeta}>
                  {trip.date} · {trip.members} members
                </Text>
              </View>
            </View>
            <Text style={styles.tripDuration}>{trip.duration}</Text>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  username: {
    fontSize: FONTSIZE.xxl,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.sm,
  },
  avatarText: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
  },

  // Card base
  card: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    ...SHADOW.md,
  },

  // Active Room Card
  activeRoomCard: {
    backgroundColor: COLORS.primary,
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
    color: COLORS.textWhite,
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
    color: COLORS.textWhite,
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
    color: COLORS.textWhite,
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
    backgroundColor: COLORS.textWhite,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    alignItems: "center",
  },
  rejoinBtnText: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },

  // No Room Card
  noRoomCard: {
    backgroundColor: COLORS.surface,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noRoomEmoji: {
    fontSize: 36,
    marginBottom: SPACING.sm,
  },
  noRoomTitle: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  noRoomSub: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },

  // Section Title
  sectionTitle: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },

  // Quick Actions
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
    backgroundColor: COLORS.primary,
  },
  actionCardOutline: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: SPACING.xs,
  },
  actionLabelPrimary: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
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
    color: COLORS.textPrimary,
  },
  actionSubOutline: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // Safety Alert Button
  alertBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff5f5",
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
    color: COLORS.danger,
  },
  alertBtnSub: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  alertBtnArrow: {
    marginLeft: "auto",
    fontSize: FONTSIZE.lg,
    color: COLORS.danger,
    fontFamily: FONTS.bold,
  },

  // Recent Trips
  tripCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    backgroundColor: COLORS.inputBg,
    alignItems: "center",
    justifyContent: "center",
  },
  tripIcon: {
    fontSize: 18,
  },
  tripName: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
  tripMeta: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tripDuration: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
});