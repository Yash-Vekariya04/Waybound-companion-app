import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  COLORS,
  FONTS,
  RADIUS,
  SPACING,
  FONTSIZE,
  SHADOW,
} from "../constants/theme";
import { getLeafletHTML } from "../utils/leafletMap";

const { width, height } = Dimensions.get("window");

export default function LiveTrackingScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [panelExpanded, setPanelExpanded] = useState(false);
  const [members, setMembers] = useState([]);

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
        })),
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
          speed: "18 km/h",
          status: "moving",
        },
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
        ...members,
      ]
    : [];

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  if (permissionDenied) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionEmoji}>📍</Text>
        <Text style={styles.permissionTitle}>Location Access Needed</Text>
        <Text style={styles.permissionSub}>
          Waybound needs your location to show you and your group on the map.
        </Text>
        <TouchableOpacity
          style={styles.goBackBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.goBackBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      {/* ── Leaflet Map ── */}
      <WebView
        style={styles.map}
        source={{
          html: getLeafletHTML(location.latitude, location.longitude, members),
        }}
        scrollEnabled={false}
        javaScriptEnabled={true}
      />

      {/* ── Top Bar Overlay ── */}
      <SafeAreaView style={styles.topOverlay} edges={["top"]}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.topBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.topBtnText}>←</Text>
          </TouchableOpacity>

          <View style={styles.roomBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.roomBadgeText}>
              Coastal Ride · {allMembers.length}{" "}
              {allMembers.length === 1 ? "member" : "members"}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.topBtn}
            onPress={() => navigation.navigate("Settings")}
          >
            <Text style={styles.topBtnText}>⋮</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* ── SOS FAB ── */}
      <TouchableOpacity
        style={styles.sosBtn}
        onPress={() => navigation.navigate("SafetyAlert")}
      >
        <Text style={styles.sosBtnText}>🚨</Text>
      </TouchableOpacity>

      {/* ── Bottom Members Panel ── */}
      <View
        style={[
          styles.bottomPanel,
          panelExpanded && styles.bottomPanelExpanded,
        ]}
      >
        <TouchableOpacity
          style={styles.panelHandle}
          onPress={() => setPanelExpanded((prev) => !prev)}
          activeOpacity={0.7}
        >
          <View style={styles.handleBar} />
          <Text style={styles.panelTitle}>
            {panelExpanded ? "▼  Members" : "▲  Members"}
          </Text>
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        >
          {allMembers.length === 0 ? (
            <View style={styles.emptyMembers}>
              <Text style={styles.emptyMembersEmoji}>👥</Text>
              <Text style={styles.emptyMembersText}>
                No other members yet. Share your room code to invite your group.
              </Text>
            </View>
          ) : (
            allMembers.map((member, index) => (
              <TouchableOpacity
                key={member.id}
                style={[
                  styles.memberRow,
                  index < allMembers.length - 1 && styles.memberRowBorder,
                ]}
                onPress={() => navigation.navigate("MemberDetail", { member })}
              >
                <View
                  style={[
                    styles.memberAvatar,
                    { backgroundColor: member.color },
                  ]}
                >
                  <Text style={styles.memberAvatarText}>{member.initials}</Text>
                </View>
                <View style={styles.memberInfo}>
                  <View style={styles.memberNameRow}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    {member.id === "1" && (
                      <View style={styles.youBadge}>
                        <Text style={styles.youBadgeText}>You</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.memberSpeed}>{member.speed ?? "—"}</Text>
                </View>
                <View
                  style={[
                    styles.memberStatusBadge,
                    member.status === "stopped" && styles.memberStatusStopped,
                  ]}
                >
                  <Text
                    style={[
                      styles.memberStatusText,
                      member.status === "stopped" &&
                        styles.memberStatusTextStopped,
                    ]}
                  >
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  permissionEmoji: { fontSize: 48, marginBottom: SPACING.md },
  permissionTitle: {
    fontSize: FONTSIZE.xl,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    textAlign: "center",
  },
  permissionSub: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  goBackBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.sm + 4,
    paddingHorizontal: SPACING.xl,
  },
  goBackBtnText: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
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
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.sm,
  },
  topBtnText: {
    fontSize: FONTSIZE.xl,
    color: COLORS.textPrimary,
    fontFamily: FONTS.bold,
  },
  roomBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
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
    color: COLORS.textPrimary,
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
    backgroundColor: COLORS.surface,
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
    backgroundColor: COLORS.border,
    marginBottom: SPACING.xs,
  },
  panelTitle: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm + 2,
    gap: SPACING.sm,
  },
  memberRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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
    color: COLORS.textWhite,
  },
  memberInfo: { flex: 1 },
  memberName: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
  memberSpeed: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
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
  emptyMembers: {
    alignItems: "center",
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
  },
  emptyMembersEmoji: {
    fontSize: 32,
  },
  emptyMembersText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  memberNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
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
    color: COLORS.textWhite,
  },
});
