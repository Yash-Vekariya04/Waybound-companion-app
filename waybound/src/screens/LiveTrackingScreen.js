import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, Dimensions, ScrollView, ActivityIndicator
} from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { FONTS, RADIUS, SPACING, FONTSIZE, SHADOW, COLORS } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";
import { getLeafletHTML } from "../utils/leafletMap";

const { width, height } = Dimensions.get("window");

export default function LiveTrackingScreen({ navigation }) {
  const { isDark, colors } = useTheme();
  const s = makeStyles(colors);

  const [location, setLocation] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [members, setMembers] = useState([
    {
      id: "2",
      name: "Aryan",
      initials: "A",
      color: "#8e44ad",
      lat: 0.001,
      lng: 0.001,
      speed: "16 km/h",
      status: "moving",
    },
  ]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setPermissionDenied(true);
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc.coords);
      setMembers((prev) =>
        prev.map((m) => ({
          ...m,
          lat: loc.coords.latitude + m.lat,
          lng: loc.coords.longitude + m.lng,
        }))
      );
      setLoading(false);
    })();
  }, []);

  const allMembers = location
    ? [
        {
          id: "1",
          name: "Yash",
          initials: "Y",
          color: COLORS.primary,
          lat: location.latitude,
          lng: location.longitude,
          speed: "—",
          status: "moving",
        },
        ...members,
      ]
    : [];

  if (loading) {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={s.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  if (permissionDenied) {
    return (
      <View style={s.centered}>
        <Text style={s.permissionEmoji}>📍</Text>
        <Text style={s.permissionTitle}>Location Access Needed</Text>
        <Text style={s.permissionSub}>
          Waybound needs your location to show you and your group on the map.
        </Text>
        <TouchableOpacity style={s.goBackBtn} onPress={() => navigation.goBack()}>
          <Text style={s.goBackBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Leaflet Map ── */}
      <WebView
        style={s.map}
        source={{ html: getLeafletHTML(location.latitude, location.longitude, members) }}
        scrollEnabled={false}
        javaScriptEnabled={true}
      />

      {/* ── Top Bar Overlay ── */}
      <SafeAreaView style={s.topOverlay} edges={["top"]}>
        <View style={s.topBar}>
          <TouchableOpacity style={s.topBtn} onPress={() => navigation.goBack()}>
            <Text style={s.topBtnText}>←</Text>
          </TouchableOpacity>
          <View style={s.roomBadge}>
            <View style={s.liveDot} />
            <Text style={s.roomBadgeText}>
              Coastal Ride · {allMembers.length}{" "}
              {allMembers.length === 1 ? "member" : "members"}
            </Text>
          </View>
          <TouchableOpacity style={s.topBtn} onPress={() => navigation.navigate("Settings")}>
            <Text style={s.topBtnText}>⋮</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ── SOS FAB ── */}
      <TouchableOpacity
        style={s.sosBtn}
        onPress={() => navigation.navigate("SafetyAlert")}
      >
        <Text style={s.sosBtnText}>🚨</Text>
      </TouchableOpacity>

      {/* ── Bottom Members Panel ── */}
      <View style={[s.bottomPanel, panelExpanded && s.bottomPanelExpanded]}>
        <TouchableOpacity
          style={s.panelHandle}
          onPress={() => setPanelExpanded((prev) => !prev)}
          activeOpacity={0.7}
        >
          <View style={s.handleBar} />
          <Text style={s.panelTitle}>
            {panelExpanded ? "▼  Members" : "▲  Members"}
          </Text>
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {allMembers.length === 0 ? (
            <View style={s.emptyMembers}>
              <Text style={s.emptyMembersEmoji}>👥</Text>
              <Text style={s.emptyMembersText}>
                No other members yet. Share your room code to invite your group.
              </Text>
            </View>
          ) : (
            allMembers.map((member, index) => (
              <TouchableOpacity
                key={member.id}
                style={[
                  s.memberRow,
                  index < allMembers.length - 1 && s.memberRowBorder,
                ]}
                onPress={() => navigation.navigate("MemberDetail", { member })}
              >
                <View style={[s.memberAvatar, { backgroundColor: member.color }]}>
                  <Text style={s.memberAvatarText}>{member.initials}</Text>
                </View>
                <View style={s.memberInfo}>
                  <View style={s.memberNameRow}>
                    <Text style={s.memberName}>{member.name}</Text>
                    {member.id === "1" && (
                      <View style={s.youBadge}>
                        <Text style={s.youBadgeText}>You</Text>
                      </View>
                    )}
                  </View>
                  <Text style={s.memberSpeed}>{member.speed ?? "—"}</Text>
                </View>
                <View style={[
                  s.memberStatusBadge,
                  member.status === "stopped" && s.memberStatusStopped,
                ]}>
                  <Text style={[
                    s.memberStatusText,
                    member.status === "stopped" && s.memberStatusTextStopped,
                  ]}>
                    {member.status === "moving" ? "Moving" : "Stopped"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const makeStyles = (colors) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    paddingHorizontal: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
  },
  permissionEmoji: { fontSize: 48, marginBottom: SPACING.md },
  permissionTitle: {
    fontSize: FONTSIZE.xl,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  permissionSub: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  goBackBtn: {
    backgroundColor: colors.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.xl,
  },
  goBackBtnText: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.bold,
    color: colors.textWhite,
  },
  map: {
    width: width,
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
  },
  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  topBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.sm,
  },
  topBtnText: {
    fontSize: FONTSIZE.xl,
    color: colors.textPrimary,
    fontFamily: FONTS.bold,
  },
  roomBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    gap: SPACING.xs,
    ...SHADOW.sm,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.secondary,
  },
  roomBadgeText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: colors.textPrimary,
  },
  sosBtn: {
    position: "absolute",
    right: SPACING.md,
    bottom: 240,
    width: 52,
    height: 52,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.danger,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.lg,
  },
  sosBtnText: { fontSize: 24 },
  bottomPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    maxHeight: 220,
    ...SHADOW.lg,
  },
  bottomPanelExpanded: {
    maxHeight: height * 0.55,
  },
  panelHandle: {
    alignItems: "center",
    paddingVertical: SPACING.sm,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: RADIUS.full,
    backgroundColor: colors.border,
    marginBottom: SPACING.xs,
  },
  panelTitle: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: colors.textSecondary,
  },
  emptyMembers: {
    alignItems: "center",
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  emptyMembersEmoji: { fontSize: 32 },
  emptyMembersText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm + 2,
    gap: SPACING.sm,
  },
  memberRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  memberAvatar: {
    width: 38,
    height: 38,
    borderRadius: RADIUS.full,
    alignItems: "center",
    justifyContent: "center",
  },
  memberAvatarText: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.bold,
    color: colors.textWhite,
  },
  memberInfo: { flex: 1 },
  memberNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  memberName: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.medium,
    color: colors.textPrimary,
  },
  youBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: 2,
  },
  youBadgeText: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.bold,
    color: colors.textWhite,
  },
  memberSpeed: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  memberStatusBadge: {
    backgroundColor: "rgba(46,204,113,0.12)",
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  memberStatusStopped: {
    backgroundColor: "rgba(231,76,60,0.1)",
  },
  memberStatusText: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.medium,
    color: COLORS.secondary,
  },
  memberStatusTextStopped: {
    color: COLORS.danger,
  },
});