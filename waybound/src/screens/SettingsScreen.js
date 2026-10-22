import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, ScrollView, Switch, Alert, Linking
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FONTS, RADIUS, SPACING, FONTSIZE, SHADOW } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";

const VERSION = "1.0.0";

export default function SettingsScreen({ navigation }) {
  const { isDark, toggleTheme, colors } = useTheme();
  const s = makeStyles(colors);

  const [notifications, setNotifications]           = useState(true);
  const [sosAlerts, setSosAlerts]                   = useState(true);
  const [memberJoin, setMemberJoin]                 = useState(true);
  const [shareLocation, setShareLocation]           = useState(true);
  const [highAccuracy, setHighAccuracy]             = useState(true);
  const [backgroundLocation, setBackgroundLocation] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => navigation.navigate("Login"),
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account and all your data. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => {} },
      ]
    );
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
        <Text style={s.topBarTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Profile Card ── */}
        <View style={s.profileCard}>
          <View style={s.avatarCircle}>
            <Text style={s.avatarText}>Y</Text>
          </View>
          <View style={s.profileInfo}>
            <Text style={s.profileName}>Yash</Text>
            <Text style={s.profileEmail}>yash@email.com</Text>
          </View>
          <TouchableOpacity style={s.editBtn}>
            <Text style={s.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* ── Appearance ── */}
        <Text style={s.sectionLabel}>Appearance</Text>
        <View style={s.settingsCard}>
          <View style={s.settingRow}>
            <View style={s.settingLeft}>
              <Text style={s.settingEmoji}>{isDark ? "🌙" : "☀️"}</Text>
              <View>
                <Text style={s.settingTitle}>Dark Mode</Text>
                <Text style={s.settingSub}>
                  {isDark ? "Dark theme is on" : "Light theme is on"}
                </Text>
              </View>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: "#ccc", true: colors.primary }}
              thumbColor={colors.textWhite}
            />
          </View>
        </View>

        {/* ── Notifications ── */}
        <Text style={s.sectionLabel}>Notifications</Text>
        <View style={s.settingsCard}>

          <View style={s.settingRow}>
            <View style={s.settingLeft}>
              <Text style={s.settingEmoji}>🔔</Text>
              <View>
                <Text style={s.settingTitle}>Push Notifications</Text>
                <Text style={s.settingSub}>All app notifications</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#ccc", true: colors.primary }}
              thumbColor={colors.textWhite}
            />
          </View>

          <View style={s.settingDivider} />

          <View style={s.settingRow}>
            <View style={s.settingLeft}>
              <Text style={s.settingEmoji}>🚨</Text>
              <View>
                <Text style={s.settingTitle}>SOS Alerts</Text>
                <Text style={s.settingSub}>Emergency alerts from members</Text>
              </View>
            </View>
            <Switch
              value={sosAlerts}
              onValueChange={setSosAlerts}
              trackColor={{ false: "#ccc", true: colors.danger }}
              thumbColor={colors.textWhite}
            />
          </View>

          <View style={s.settingDivider} />

          <View style={s.settingRow}>
            <View style={s.settingLeft}>
              <Text style={s.settingEmoji}>👥</Text>
              <View>
                <Text style={s.settingTitle}>Member Joined</Text>
                <Text style={s.settingSub}>When someone joins your room</Text>
              </View>
            </View>
            <Switch
              value={memberJoin}
              onValueChange={setMemberJoin}
              trackColor={{ false: "#ccc", true: colors.primary }}
              thumbColor={colors.textWhite}
            />
          </View>

        </View>

        {/* ── Location ── */}
        <Text style={s.sectionLabel}>Location & Privacy</Text>
        <View style={s.settingsCard}>

          <View style={s.settingRow}>
            <View style={s.settingLeft}>
              <Text style={s.settingEmoji}>📍</Text>
              <View>
                <Text style={s.settingTitle}>Share Location</Text>
                <Text style={s.settingSub}>Visible to room members</Text>
              </View>
            </View>
            <Switch
              value={shareLocation}
              onValueChange={setShareLocation}
              trackColor={{ false: "#ccc", true: colors.primary }}
              thumbColor={colors.textWhite}
            />
          </View>

          <View style={s.settingDivider} />

          <View style={s.settingRow}>
            <View style={s.settingLeft}>
              <Text style={s.settingEmoji}>🎯</Text>
              <View>
                <Text style={s.settingTitle}>High Accuracy GPS</Text>
                <Text style={s.settingSub}>Uses more battery</Text>
              </View>
            </View>
            <Switch
              value={highAccuracy}
              onValueChange={setHighAccuracy}
              trackColor={{ false: "#ccc", true: colors.primary }}
              thumbColor={colors.textWhite}
            />
          </View>

          <View style={s.settingDivider} />

          <View style={s.settingRow}>
            <View style={s.settingLeft}>
              <Text style={s.settingEmoji}>🔄</Text>
              <View>
                <Text style={s.settingTitle}>Background Location</Text>
                <Text style={s.settingSub}>Track when app is minimised</Text>
              </View>
            </View>
            <Switch
              value={backgroundLocation}
              onValueChange={setBackgroundLocation}
              trackColor={{ false: "#ccc", true: colors.primary }}
              thumbColor={colors.textWhite}
            />
          </View>

        </View>

        {/* ── App ── */}
        <Text style={s.sectionLabel}>App</Text>
        <View style={s.settingsCard}>

          <TouchableOpacity style={s.settingRow}>
            <View style={s.settingLeft}>
              <Text style={s.settingEmoji}>🗺️</Text>
              <Text style={s.settingTitle}>Trip History</Text>
            </View>
            <Text style={s.settingArrow}>→</Text>
          </TouchableOpacity>

          <View style={s.settingDivider} />

          <TouchableOpacity
            style={s.settingRow}
            onPress={() => Linking.openURL("https://waybound.app/privacy")}
          >
            <View style={s.settingLeft}>
              <Text style={s.settingEmoji}>🔒</Text>
              <Text style={s.settingTitle}>Privacy Policy</Text>
            </View>
            <Text style={s.settingArrow}>→</Text>
          </TouchableOpacity>

          <View style={s.settingDivider} />

          <TouchableOpacity
            style={s.settingRow}
            onPress={() => Linking.openURL("https://waybound.app/terms")}
          >
            <View style={s.settingLeft}>
              <Text style={s.settingEmoji}>📋</Text>
              <Text style={s.settingTitle}>Terms of Service</Text>
            </View>
            <Text style={s.settingArrow}>→</Text>
          </TouchableOpacity>

          <View style={s.settingDivider} />

          <TouchableOpacity
            style={s.settingRow}
            onPress={() => Linking.openURL("mailto:support@waybound.app?subject=Feedback")}
          >
            <View style={s.settingLeft}>
              <Text style={s.settingEmoji}>💬</Text>
              <Text style={s.settingTitle}>Send Feedback</Text>
            </View>
            <Text style={s.settingArrow}>→</Text>
          </TouchableOpacity>

        </View>

        {/* ── App Info ── */}
        <View style={s.appInfoCard}>
          <Text style={s.appInfoEmoji}>🧭</Text>
          <Text style={s.appInfoName}>Waybound</Text>
          <Text style={s.appInfoVersion}>Version {VERSION}</Text>
          <Text style={s.appInfoTagline}>Ride together. Stay safe.</Text>
        </View>

        {/* ── Log Out ── */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Text style={s.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>

        {/* ── Delete Account ── */}
        <TouchableOpacity style={s.deleteBtn} onPress={handleDeleteAccount}>
          <Text style={s.deleteBtnText}>Delete Account</Text>
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: SPACING.md,
    ...SHADOW.md,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.sm,
  },
  avatarText: {
    fontSize: FONTSIZE.xl,
    fontFamily: FONTS.bold,
    color: colors.textWhite,
  },
  profileInfo: { flex: 1 },
  profileName: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
  },
  profileEmail: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  editBtn: {
    backgroundColor: colors.inputBg,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editBtnText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: colors.primary,
  },
  sectionLabel: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: colors.textSecondary,
    marginBottom: SPACING.sm,
  },
  settingsCard: {
    backgroundColor: colors.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: SPACING.lg,
    ...SHADOW.sm,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: SPACING.md,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    flex: 1,
  },
  settingEmoji: {
    fontSize: 20,
    width: 28,
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
  settingDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  settingArrow: {
    fontSize: FONTSIZE.lg,
    color: colors.textMuted,
    fontFamily: FONTS.medium,
  },
  appInfoCard: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...SHADOW.sm,
  },
  appInfoEmoji: {
    fontSize: 36,
    marginBottom: SPACING.sm,
  },
  appInfoName: {
    fontSize: FONTSIZE.xl,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
  },
  appInfoVersion: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  appInfoTagline: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.regular,
    color: colors.textMuted,
    marginTop: SPACING.xs,
    fontStyle: "italic",
  },
  logoutBtn: {
    backgroundColor: colors.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...SHADOW.sm,
  },
  logoutBtnText: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: colors.danger,
  },
  deleteBtn: {
    alignItems: "center",
    paddingVertical: SPACING.sm,
  },
  deleteBtnText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: colors.textMuted,
    textDecorationLine: "underline",
  },
});