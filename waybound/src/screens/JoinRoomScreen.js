import React, { useState, useRef } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, StatusBar, SafeAreaView, ScrollView, Keyboard
} from "react-native";
import { COLORS, FONTS, RADIUS, SPACING, FONTSIZE, SHADOW } from "../constants/theme";

const RECENT_CODES = [
  { id: "1", name: "Coastal Ride", code: "WB-K7NP", members: 4, icon: "🚴" },
  { id: "2", name: "Mountain Loop", code: "WB-3QXM", members: 6, icon: "🥾" },
];

export default function JoinRoomScreen({ navigation }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleCodeChange = (text) => {
    // Auto format to WB-XXXX
    let cleaned = text.toUpperCase().replace(/[^A-Z0-9-]/g, "");
    if (cleaned.length > 7) cleaned = cleaned.slice(0, 7);
    setCode(cleaned);
    setError("");
  };

  const handleJoin = () => {
    Keyboard.dismiss();
    if (!code.trim()) {
      setError("Please enter a room code.");
      return;
    }
    if (!code.startsWith("WB-") || code.length < 7) {
      setError("Invalid code format. Should look like WB-K7NP.");
      return;
    }
    // Navigate to live tracking (backend validation comes later)
    navigation.navigate("LiveTracking");
  };

  const handleRecentJoin = (recentCode) => {
    setCode(recentCode);
    setError("");
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
        <Text style={styles.topBarTitle}>Join Room</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        {/* ── Hero ── */}
        <View style={styles.heroSection}>
          <View style={styles.heroIconCircle}>
            <Text style={styles.heroIcon}>🔗</Text>
          </View>
          <Text style={styles.heroTitle}>Enter Room Code</Text>
          <Text style={styles.heroSub}>
            Ask your group leader for the code and type it below.
          </Text>
        </View>

        {/* ── Code Input ── */}
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            style={[styles.codeInput, error ? styles.codeInputError : null]}
            placeholder="WB-XXXX"
            placeholderTextColor={COLORS.textMuted}
            value={code}
            onChangeText={handleCodeChange}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={7}
          />
          {error ? (
            <Text style={styles.errorText}>⚠️ {error}</Text>
          ) : (
            <Text style={styles.inputHint}>
              Codes always start with WB- followed by 4 characters.
            </Text>
          )}
        </View>

        {/* ── Join Button ── */}
        <TouchableOpacity
          style={[
            styles.joinBtn,
            code.length < 7 && styles.joinBtnDisabled
          ]}
          onPress={handleJoin}
          disabled={code.length < 7}
        >
          <Text style={styles.joinBtnText}>Join Room →</Text>
        </TouchableOpacity>

        {/* ── Divider ── */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or pick a recent room</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* ── Recent Rooms ── */}
        {RECENT_CODES.map((room) => (
          <TouchableOpacity
            key={room.id}
            style={styles.recentCard}
            onPress={() => handleRecentJoin(room.code)}
          >
            <View style={styles.recentLeft}>
              <View style={styles.recentIconCircle}>
                <Text style={styles.recentIcon}>{room.icon}</Text>
              </View>
              <View>
                <Text style={styles.recentName}>{room.name}</Text>
                <Text style={styles.recentMeta}>
                  {room.code} · {room.members} members
                </Text>
              </View>
            </View>
            <Text style={styles.recentArrow}>→</Text>
          </TouchableOpacity>
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

  // Hero
  heroSection: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  heroIconCircle: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
    ...SHADOW.md,
  },
  heroIcon: {
    fontSize: 36,
  },
  heroTitle: {
    fontSize: FONTSIZE.xxl,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  heroSub: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },

  // Code Input
  inputWrapper: {
    marginBottom: SPACING.lg,
  },
  codeInput: {
    backgroundColor: COLORS.inputBg,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONTSIZE.huge,
    fontFamily: FONTS.bold,
    color: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.border,
    textAlign: "center",
    letterSpacing: 4,
  },
  codeInputError: {
    borderColor: COLORS.danger,
  },
  inputHint: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    textAlign: "center",
    marginTop: SPACING.sm,
  },
  errorText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.danger,
    textAlign: "center",
    marginTop: SPACING.sm,
  },

  // Join Button
  joinBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    marginBottom: SPACING.lg,
    ...SHADOW.md,
  },
  joinBtnDisabled: {
    backgroundColor: COLORS.border,
  },
  joinBtnText: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
  },

  // Divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    marginHorizontal: SPACING.sm,
  },

  // Recent Cards
  recentCard: {
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
  recentLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  recentIconCircle: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.inputBg,
    alignItems: "center",
    justifyContent: "center",
  },
  recentIcon: {
    fontSize: 20,
  },
  recentName: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },
  recentMeta: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  recentArrow: {
    fontSize: FONTSIZE.lg,
    color: COLORS.textMuted,
    fontFamily: FONTS.medium,
  },
});