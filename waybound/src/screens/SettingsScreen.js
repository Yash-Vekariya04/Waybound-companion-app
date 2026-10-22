import React, { useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  StatusBar, ScrollView, Switch, Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, FONTS, RADIUS, SPACING, FONTSIZE, SHADOW } from "../constants/theme";

const VERSION = "1.0.0";

export default function SettingsScreen({ navigation }) {
  const [notifications, setNotifications]     = useState(true);
  const [sosAlerts, setSosAlerts]             = useState(true);
  const [memberJoin, setMemberJoin]           = useState(true);
  const [shareLocation, setShareLocation]     = useState(true);
  const [highAccuracy, setHighAccuracy]       = useState(true);
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
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {},
        },
      ]
    );
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
        <Text style={styles.topBarTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Profile Card ── */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>Y</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Yash</Text>
            <Text style={styles.profileEmail}>yash@email.com</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* ── Notifications ── */}
        <Text style={styles.sectionLabel}>Notifications</Text>
        <View style={styles.settingsCard}>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingEmoji}>🔔</Text>
              <View>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingSub}>All app notifications</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.textWhite}
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingEmoji}>🚨</Text>
              <View>
                <Text style={styles.settingTitle}>SOS Alerts</Text>
                <Text style={styles.settingSub}>Emergency alerts from members</Text>
              </View>
            </View>
            <Switch
              value={sosAlerts}
              onValueChange={setSosAlerts}
              trackColor={{ false: COLORS.border, true: COLORS.danger }}
              thumbColor={COLORS.textWhite}
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingEmoji}>👥</Text>
              <View>
                <Text style={styles.settingTitle}>Member Joined</Text>
                <Text style={styles.settingSub}>When someone joins your room</Text>
              </View>
            </View>
            <Switch
              value={memberJoin}
              onValueChange={setMemberJoin}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.textWhite}
            />
          </View>

        </View>

        {/* ── Location ── */}
        <Text style={styles.sectionLabel}>Location & Privacy</Text>
        <View style={styles.settingsCard}>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingEmoji}>📍</Text>
              <View>
                <Text style={styles.settingTitle}>Share Location</Text>
                <Text style={styles.settingSub}>Visible to room members</Text>
              </View>
            </View>
            <Switch
              value={shareLocation}
              onValueChange={setShareLocation}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.textWhite}
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingEmoji}>🎯</Text>
              <View>
                <Text style={styles.settingTitle}>High Accuracy GPS</Text>
                <Text style={styles.settingSub}>Uses more battery</Text>
              </View>
            </View>
            <Switch
              value={highAccuracy}
              onValueChange={setHighAccuracy}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.textWhite}
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingEmoji}>🔄</Text>
              <View>
                <Text style={styles.settingTitle}>Background Location</Text>
                <Text style={styles.settingSub}>Track when app is minimised</Text>
              </View>
            </View>
            <Switch
              value={backgroundLocation}
              onValueChange={setBackgroundLocation}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.textWhite}
            />
          </View>

        </View>

        {/* ── App ── */}
        <Text style={styles.sectionLabel}>App</Text>
        <View style={styles.settingsCard}>

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingEmoji}>🗺️</Text>
              <Text style={styles.settingTitle}>Trip History</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.settingDivider} />

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingEmoji}>🔒</Text>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.settingDivider} />

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingEmoji}>📋</Text>
              <Text style={styles.settingTitle}>Terms of Service</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <View style={styles.settingDivider} />

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingEmoji}>💬</Text>
              <Text style={styles.settingTitle}>Send Feedback</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

        </View>

        {/* ── App Info ── */}
        <View style={styles.appInfoCard}>
          <Text style={styles.appInfoEmoji}>🧭</Text>
          <Text style={styles.appInfoName}>Waybound</Text>
          <Text style={styles.appInfoVersion}>Version {VERSION}</Text>
          <Text style={styles.appInfoTagline}>Ride together. Stay safe.</Text>
        </View>

        {/* ── Log Out ── */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Text style={styles.logoutBtnText}>Log Out</Text>
        </TouchableOpacity>

        {/* ── Delete Account ── */}
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={handleDeleteAccount}
        >
          <Text style={styles.deleteBtnText}>Delete Account</Text>
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
    ...SHADOW.md,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    ...SHADOW.sm,
  },
  avatarText: {
    fontSize: FONTSIZE.xl,
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  profileEmail: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  editBtn: {
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  editBtnText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },

  // Section Label
  sectionLabel: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },

  // Settings Card
  settingsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.textPrimary,
  },
  settingSub: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  settingDivider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  settingArrow: {
    fontSize: FONTSIZE.lg,
    color: COLORS.textMuted,
    fontFamily: FONTS.medium,
  },

  // App Info Card
  appInfoCard: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  appInfoEmoji: {
    fontSize: 36,
    marginBottom: SPACING.sm,
  },
  appInfoName: {
    fontSize: FONTSIZE.xl,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  appInfoVersion: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  appInfoTagline: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    fontStyle: "italic",
  },

  // Log Out
  logoutBtn: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW.sm,
  },
  logoutBtnText: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.danger,
  },

  // Delete Account
  deleteBtn: {
    alignItems: "center",
    paddingVertical: SPACING.sm,
  },
  deleteBtnText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textMuted,
    textDecorationLine: "underline",
  },
});