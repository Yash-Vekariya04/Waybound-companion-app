import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Switch,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {
  COLORS,
  FONTS,
  RADIUS,
  SPACING,
  FONTSIZE,
  SHADOW,
} from "../constants/theme";

const ROOM_ICONS = ["🚴", "🏍️", "🚗", "🥾", "⛵", "🏕️"];

export default function CreateRoomScreen({ navigation }) {
  const [roomName, setRoomName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("🚴");
  const [maxMembers, setMaxMembers] = useState(6);
  const [safetyAlerts, setSafetyAlerts] = useState(true);
  const [shareLocation, setShareLocation] = useState(true);
  const [isPrivate, setIsPrivate] = useState(true);

  const [generatedCode] = useState(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const segment = () =>
      Array.from({ length: 4 }, () =>
        chars[Math.floor(Math.random() * chars.length)]
      ).join("");
    return `WB-${segment()}`;
  });

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
        <Text style={styles.topBarTitle}>Create Room</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Room Icon Picker ── */}
        <Text style={styles.sectionLabel}>Choose an Icon</Text>
        <View style={styles.iconRow}>
          {ROOM_ICONS.map((icon) => (
            <TouchableOpacity
              key={icon}
              style={[
                styles.iconBtn,
                selectedIcon === icon && styles.iconBtnActive,
              ]}
              onPress={() => setSelectedIcon(icon)}
            >
              <Text style={styles.iconEmoji}>{icon}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Room Name ── */}
        <Text style={styles.sectionLabel}>Room Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Coastal Ride"
          placeholderTextColor={COLORS.textMuted}
          value={roomName}
          onChangeText={setRoomName}
          maxLength={30}
        />
        <Text style={styles.charCount}>{roomName.length}/30</Text>

        {/* ── Max Members ── */}
        <Text style={styles.sectionLabel}>Max Members</Text>
        <View style={styles.memberCountRow}>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => setMaxMembers(Math.max(2, maxMembers - 1))}
          >
            <Text style={styles.counterBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>{maxMembers}</Text>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => setMaxMembers(Math.min(20, maxMembers + 1))}
          >
            <Text style={styles.counterBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* ── Settings Toggles ── */}
        <Text style={styles.sectionLabel}>Room Settings</Text>
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>Private Room</Text>
              <Text style={styles.settingSub}>Only joinable via room code</Text>
            </View>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.textWhite}
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>Safety Alerts</Text>
              <Text style={styles.settingSub}>Allow members to send SOS</Text>
            </View>
            <Switch
              value={safetyAlerts}
              onValueChange={setSafetyAlerts}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.textWhite}
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View>
              <Text style={styles.settingTitle}>Share Location</Text>
              <Text style={styles.settingSub}>
                Broadcast your position live
              </Text>
            </View>
            <Switch
              value={shareLocation}
              onValueChange={setShareLocation}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.textWhite}
            />
          </View>
        </View>

        {/* ── Generated Room Code Preview ── */}
        <Text style={styles.sectionLabel}>Your Room Code</Text>
        <View style={styles.codeCard}>
          <View>
            <Text style={styles.codeLabel}>Share this with your group</Text>
            <Text style={styles.codeValue}>{generatedCode}</Text>
          </View>
          <TouchableOpacity style={styles.copyBtn}>
            <Text style={styles.copyBtnText}>Copy</Text>
          </TouchableOpacity>
        </View>

        {/* ── Create Button ── */}
        <TouchableOpacity
          style={[
            styles.createBtn,
            !roomName.trim() && styles.createBtnDisabled,
          ]}
          onPress={() => navigation.navigate("LiveTracking")}
          disabled={!roomName.trim()}
        >
          <Text style={styles.createBtnText}>{selectedIcon} Create Room</Text>
        </TouchableOpacity>

        {!roomName.trim() && (
          <Text style={styles.createHint}>Enter a room name to continue</Text>
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
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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

  // Section Label
  sectionLabel: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },

  // Icon Picker
  iconRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.inputBg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  iconBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surface,
    ...SHADOW.sm,
  },
  iconEmoji: {
    fontSize: 22,
  },

  // Input
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.regular,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  charCount: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    textAlign: "right",
    marginTop: 4,
  },

  // Member Counter
  memberCountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.lg,
  },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.inputBg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  counterBtnText: {
    fontSize: FONTSIZE.xl,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  counterValue: {
    fontSize: FONTSIZE.xxl,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    minWidth: 32,
    textAlign: "center",
  },

  // Settings Card
  settingsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.sm,
  },
  settingDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  settingTitle: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
  settingSub: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // Room Code Card
  codeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  codeLabel: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  codeValue: {
    fontSize: FONTSIZE.xxl,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    letterSpacing: 2,
    marginTop: 2,
  },
  copyBtn: {
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  copyBtnText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },

  // Create Button
  createBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginTop: SPACING.lg,
    ...SHADOW.md,
  },
  createBtnDisabled: {
    backgroundColor: COLORS.border,
  },
  createBtnText: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
  },
  createHint: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: SPACING.sm,
  },
});
