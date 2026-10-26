import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { FONTS, RADIUS, SPACING, FONTSIZE, SHADOW } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { getMyRooms } from "../services/api";

export default function HomeScreen({ navigation }) {
  const { isDark, colors } = useTheme();
  const { user, clearSession } = useAuth();
  const s = makeStyles(colors);

  const [recentRooms, setRecentRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch rooms every time screen comes into focus ──

  async function fetchRooms() {
    setLoading(true);
    try {
      const result = await getMyRooms();
      setRecentRooms(result.rooms);
    } catch (error) {
      console.log("Fetch rooms error:", error.message);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchRooms();
    }, []),
  );

  async function handleLogout() {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await clearSession();
          navigation.replace("Login");
        },
      },
    ]);
  }

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
            <Text style={s.greeting}>Hello, {user?.name} 👋</Text>
            <Text style={s.subtitle}>Ready to ride?</Text>
          </View>
          <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
            <Text style={s.logoutBtnText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        {/* ── Action Buttons ── */}
        <View style={s.actionRow}>
          <TouchableOpacity
            style={[s.actionBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate("CreateRoom")}
          >
            <Text style={s.actionIcon}>＋</Text>
            <Text style={s.actionBtnText}>Create Room</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.actionBtn, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate("JoinRoom")}
          >
            <Text style={s.actionIcon}>🔗</Text>
            <Text style={[s.actionBtnText, { color: colors.textPrimary }]}>
              Join Room
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Recent Rooms ── */}
        <Text style={s.sectionTitle}>Recent Rooms</Text>

        {loading ? (
          <View style={s.loadingBox}>
            <ActivityIndicator color={colors.primary} />
            <Text style={s.loadingText}>Loading your rooms...</Text>
          </View>
        ) : recentRooms.length === 0 ? (
          <View style={s.emptyBox}>
            <Text style={s.emptyIcon}>🗺️</Text>
            <Text style={s.emptyTitle}>No rooms yet</Text>
            <Text style={s.emptySub}>
              Create or join a room to start riding together!
            </Text>
          </View>
        ) : (
          recentRooms.map((room) => (
            <TouchableOpacity
              key={room._id}
              style={s.roomCard}
              onPress={() => navigation.navigate("LiveTracking", { room })}
            >
              <View style={s.roomCardLeft}>
                <Text style={s.roomCardIcon}>{room.icon}</Text>
                <View>
                  <Text style={s.roomCardName}>{room.name}</Text>
                  <Text style={s.roomCardCode}>{room.code}</Text>
                </View>
              </View>
              <View style={s.roomCardRight}>
                <Text style={s.roomCardMembers}>
                  👥 {room.members.length} member
                  {room.members.length !== 1 ? "s" : ""}
                </Text>
                <View style={s.roomCardActiveBadge}>
                  <Text style={s.roomCardCode}>
                    Created {new Date(room.createdAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
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

    // ── Header ───────────────────────────────────────
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: SPACING.lg,
    },
    greeting: {
      fontSize: FONTSIZE.xl,
      fontFamily: FONTS.bold,
      color: colors.textPrimary,
    },
    subtitle: {
      fontSize: FONTSIZE.sm,
      fontFamily: FONTS.regular,
      color: colors.textSecondary,
      marginTop: 2,
    },
    logoutBtn: {
      backgroundColor: colors.inputBg,
      borderRadius: RADIUS.md,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.xs,
      borderWidth: 1,
      borderColor: colors.border,
    },
    logoutBtnText: {
      fontSize: FONTSIZE.sm,
      fontFamily: FONTS.medium,
      color: colors.textSecondary,
    },

    // ── Action Buttons ────────────────────────────────
    actionRow: {
      flexDirection: "row",
      gap: SPACING.md,
      marginBottom: SPACING.xl,
    },
    actionBtn: {
      flex: 1,
      borderRadius: RADIUS.lg,
      paddingVertical: SPACING.lg,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
      ...SHADOW.sm,
    },
    actionIcon: {
      fontSize: 28,
      marginBottom: SPACING.xs,
    },
    actionBtnText: {
      fontSize: FONTSIZE.sm,
      fontFamily: FONTS.bold,
      color: colors.textWhite,
    },

    // ── Section Title ─────────────────────────────────
    sectionTitle: {
      fontSize: FONTSIZE.md,
      fontFamily: FONTS.bold,
      color: colors.textPrimary,
      marginBottom: SPACING.md,
    },

    // ── Loading ───────────────────────────────────────
    loadingBox: {
      alignItems: "center",
      paddingVertical: SPACING.xl,
      gap: SPACING.sm,
    },
    loadingText: {
      fontSize: FONTSIZE.sm,
      fontFamily: FONTS.regular,
      color: colors.textSecondary,
    },

    // ── Empty State ───────────────────────────────────
    emptyBox: {
      alignItems: "center",
      paddingVertical: SPACING.xxl,
      backgroundColor: colors.surface,
      borderRadius: RADIUS.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    emptyIcon: {
      fontSize: 40,
      marginBottom: SPACING.md,
    },
    emptyTitle: {
      fontSize: FONTSIZE.md,
      fontFamily: FONTS.bold,
      color: colors.textPrimary,
      marginBottom: SPACING.xs,
    },
    emptySub: {
      fontSize: FONTSIZE.sm,
      fontFamily: FONTS.regular,
      color: colors.textSecondary,
      textAlign: "center",
      paddingHorizontal: SPACING.lg,
    },

    // ── Room Card ─────────────────────────────────────
    roomCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: RADIUS.lg,
      padding: SPACING.md,
      marginBottom: SPACING.md,
      borderWidth: 1,
      borderColor: colors.border,
      ...SHADOW.sm,
    },
    roomCardLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.md,
    },
    roomCardIcon: {
      fontSize: 28,
    },
    roomCardName: {
      fontSize: FONTSIZE.md,
      fontFamily: FONTS.bold,
      color: colors.textPrimary,
    },
    roomCardCode: {
      fontSize: FONTSIZE.xs,
      fontFamily: FONTS.regular,
      color: colors.textSecondary,
      marginTop: 2,
    },
    roomCardRight: {
      alignItems: "flex-end",
      gap: SPACING.xs,
    },
    roomCardMembers: {
      fontSize: FONTSIZE.xs,
      fontFamily: FONTS.regular,
      color: colors.textSecondary,
    },
    roomCardActiveBadge: {
      backgroundColor: "#E8F5E9",
      borderRadius: RADIUS.sm,
      paddingHorizontal: SPACING.sm,
      paddingVertical: 2,
    },
    roomCardActiveBadgeText: {
      fontSize: FONTSIZE.xs,
      fontFamily: FONTS.medium,
      color: "#2D6A4F",
    },
  });
