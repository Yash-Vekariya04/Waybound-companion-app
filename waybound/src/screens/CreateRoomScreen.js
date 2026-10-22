import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, StatusBar, Switch, Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Clipboard from "expo-clipboard";
import { FONTS, RADIUS, SPACING, FONTSIZE, SHADOW } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";

const ROOM_ICONS = ["🚴", "🏍️", "🚗", "🥾", "⛵", "🏕️"];

export default function CreateRoomScreen({ navigation }) {
  const { isDark, colors } = useTheme();
  const s = makeStyles(colors);

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
        <Text style={s.topBarTitle}>Create Room</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Room Icon Picker ── */}
        <Text style={s.sectionLabel}>Choose an Icon</Text>
        <View style={s.iconRow}>
          {ROOM_ICONS.map((icon) => (
            <TouchableOpacity
              key={icon}
              style={[s.iconBtn, selectedIcon === icon && s.iconBtnActive]}
              onPress={() => setSelectedIcon(icon)}
            >
              <Text style={s.iconEmoji}>{icon}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Room Name ── */}
        <Text style={s.sectionLabel}>Room Name</Text>
        <TextInput
          style={s.input}
          placeholder="e.g. Coastal Ride"
          placeholderTextColor={colors.textMuted}
          value={roomName}
          onChangeText={setRoomName}
          maxLength={30}
        />
        <Text style={s.charCount}>{roomName.length}/30</Text>

        {/* ── Max Members ── */}
        <Text style={s.sectionLabel}>Max Members</Text>
        <View style={s.memberCountRow}>
          <TouchableOpacity
            style={s.counterBtn}
            onPress={() => setMaxMembers(Math.max(2, maxMembers - 1))}
          >
            <Text style={s.counterBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={s.counterValue}>{maxMembers}</Text>
          <TouchableOpacity
            style={s.counterBtn}
            onPress={() => setMaxMembers(Math.min(20, maxMembers + 1))}
          >
            <Text style={s.counterBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* ── Settings Toggles ── */}
        <Text style={s.sectionLabel}>Room Settings</Text>
        <View style={s.settingsCard}>

          <View style={s.settingRow}>
            <View>
              <Text style={s.settingTitle}>Private Room</Text>
              <Text style={s.settingSub}>Only joinable via room code</Text>
            </View>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.textWhite}
            />
          </View>

          <View style={s.settingDivider} />

          <View style={s.settingRow}>
            <View>
              <Text style={s.settingTitle}>Safety Alerts</Text>
              <Text style={s.settingSub}>Allow members to send SOS</Text>
            </View>
            <Switch
              value={safetyAlerts}
              onValueChange={setSafetyAlerts}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.textWhite}
            />
          </View>

          <View style={s.settingDivider} />

          <View style={s.settingRow}>
            <View>
              <Text style={s.settingTitle}>Share Location</Text>
              <Text style={s.settingSub}>Broadcast your position live</Text>
            </View>
            <Switch
              value={shareLocation}
              onValueChange={setShareLocation}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.textWhite}
            />
          </View>

        </View>

        {/* ── Generated Room Code Preview ── */}
        <Text style={s.sectionLabel}>Your Room Code</Text>
        <View style={s.codeCard}>
          <View>
            <Text style={s.codeLabel}>Share this with your group</Text>
            <Text style={s.codeValue}>{generatedCode}</Text>
          </View>
          <TouchableOpacity
            style={s.copyBtn}
            onPress={async () => {
              await Clipboard.setStringAsync(generatedCode);
              Alert.alert("Copied!", `Room code ${generatedCode} copied to clipboard.`);
            }}
          >
            <Text style={s.copyBtnText}>Copy</Text>
          </TouchableOpacity>
        </View>

        {/* ── Create Button ── */}
        <TouchableOpacity
          style={[s.createBtn, !roomName.trim() && s.createBtnDisabled]}
          onPress={() => navigation.navigate("LiveTracking")}
          disabled={!roomName.trim()}
        >
          <Text style={s.createBtnText}>
            {selectedIcon} Create Room
          </Text>
        </TouchableOpacity>

        {!roomName.trim() && (
          <Text style={s.createHint}>Enter a room name to continue</Text>
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
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
  sectionLabel: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: colors.textSecondary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  iconRow: {
    flexDirection: "row",
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  iconBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    ...SHADOW.sm,
  },
  iconEmoji: {
    fontSize: 22,
  },
  input: {
    backgroundColor: colors.inputBg,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 4,
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.regular,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  charCount: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: colors.textMuted,
    textAlign: "right",
    marginTop: 4,
  },
  memberCountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.lg,
  },
  counterBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: colors.inputBg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  counterBtnText: {
    fontSize: FONTSIZE.xl,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
  },
  counterValue: {
    fontSize: FONTSIZE.xxl,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
    minWidth: 32,
    textAlign: "center",
  },
  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: colors.border,
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
    backgroundColor: colors.border,
  },
  settingTitle: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.medium,
    color: colors.textPrimary,
  },
  settingSub: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  codeCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...SHADOW.sm,
  },
  codeLabel: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
  },
  codeValue: {
    fontSize: FONTSIZE.xxl,
    fontFamily: FONTS.bold,
    color: colors.primary,
    letterSpacing: 2,
    marginTop: 2,
  },
  copyBtn: {
    backgroundColor: colors.inputBg,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  copyBtnText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: colors.primary,
  },
  createBtn: {
    backgroundColor: colors.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginTop: SPACING.lg,
    ...SHADOW.md,
  },
  createBtnDisabled: {
    backgroundColor: colors.border,
  },
  createBtnText: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: colors.textWhite,
  },
  createHint: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: colors.textMuted,
    textAlign: "center",
    marginTop: SPACING.sm,
  },
});