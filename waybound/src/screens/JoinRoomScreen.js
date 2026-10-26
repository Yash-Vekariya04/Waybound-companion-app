import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ScrollView,
  Keyboard,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FONTS, RADIUS, SPACING, FONTSIZE, SHADOW } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";
import { joinRoom } from "../services/api";

const RECENT_CODES = [
  { id: "1", name: "Coastal Ride", code: "WB-K7NP", members: 4, icon: "🚴" },
  { id: "2", name: "Mountain Loop", code: "WB-3QXM", members: 6, icon: "🥾" },
];

export default function JoinRoomScreen({ navigation }) {
  const { isDark, colors } = useTheme();
  const s = makeStyles(colors);

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handleCodeChange = (text) => {
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
    navigation.navigate("LiveTracking");
  };

  const handleRecentJoin = (recentCode) => {
    setCode(recentCode);
    setError("");
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
        <Text style={s.topBarTitle}>Join Room</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Hero ── */}
        <View style={s.heroSection}>
          <View style={s.heroIconCircle}>
            <Text style={s.heroIcon}>🔗</Text>
          </View>
          <Text style={s.heroTitle}>Enter Room Code</Text>
          <Text style={s.heroSub}>
            Ask your group leader for the code and type it below.
          </Text>
        </View>

        {/* ── Code Input ── */}
        <View style={s.inputWrapper}>
          <TextInput
            ref={inputRef}
            style={[s.codeInput, error ? s.codeInputError : null]}
            placeholder="WB-XXXX"
            placeholderTextColor={colors.textMuted}
            value={code}
            onChangeText={handleCodeChange}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={7}
          />
          {error ? (
            <Text style={s.errorText}>⚠️ {error}</Text>
          ) : (
            <Text style={s.inputHint}>
              Codes always start with WB- followed by 4 characters.
            </Text>
          )}
        </View>

        {/* ── Join Button ── */}
        <TouchableOpacity
          style={[s.joinBtn, code.length < 7 && s.joinBtnDisabled]}
          onPress={async () => {
            if (!code.trim()) return;
            setLoading(true);
            try {
              const result = await joinRoom({ code: code.trim() });
              navigation.navigate("LiveTracking", { room: result.room });
            } catch (error) {
              Alert.alert("Error", error.message);
            } finally {
              setLoading(false);
            }
          }}
          disabled={!code.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.textWhite} />
          ) : (
            <Text style={s.joinBtnText}>Join Room</Text>
          )}
        </TouchableOpacity>

        {/* ── Divider ── */}
        <View style={s.dividerRow}>
          <View style={s.dividerLine} />
          <Text style={s.dividerText}>or pick a recent room</Text>
          <View style={s.dividerLine} />
        </View>

        {/* ── Recent Rooms ── */}
        {RECENT_CODES.map((room) => (
          <TouchableOpacity
            key={room.id}
            style={s.recentCard}
            onPress={() => handleRecentJoin(room.code)}
          >
            <View style={s.recentLeft}>
              <View style={s.recentIconCircle}>
                <Text style={s.recentIcon}>{room.icon}</Text>
              </View>
              <View>
                <Text style={s.recentName}>{room.name}</Text>
                <Text style={s.recentMeta}>
                  {room.code} · {room.members} members
                </Text>
              </View>
            </View>
            <Text style={s.recentArrow}>→</Text>
          </TouchableOpacity>
        ))}
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
    heroSection: {
      alignItems: "center",
      marginBottom: SPACING.xl,
    },
    heroIconCircle: {
      width: 72,
      height: 72,
      borderRadius: RADIUS.xl,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: SPACING.md,
      ...SHADOW.md,
    },
    heroIcon: { fontSize: 36 },
    heroTitle: {
      fontSize: FONTSIZE.xxl,
      fontFamily: FONTS.bold,
      color: colors.textPrimary,
      marginBottom: SPACING.xs,
    },
    heroSub: {
      fontSize: FONTSIZE.md,
      fontFamily: FONTS.regular,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
    },
    inputWrapper: {
      marginBottom: SPACING.lg,
    },
    codeInput: {
      backgroundColor: colors.inputBg,
      borderRadius: RADIUS.lg,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      fontSize: FONTSIZE.huge,
      fontFamily: FONTS.bold,
      color: colors.primary,
      borderWidth: 2,
      borderColor: colors.border,
      textAlign: "center",
      letterSpacing: 4,
    },
    codeInputError: {
      borderColor: colors.danger,
    },
    inputHint: {
      fontSize: FONTSIZE.xs,
      fontFamily: FONTS.regular,
      color: colors.textMuted,
      textAlign: "center",
      marginTop: SPACING.sm,
    },
    errorText: {
      fontSize: FONTSIZE.sm,
      fontFamily: FONTS.medium,
      color: colors.danger,
      textAlign: "center",
      marginTop: SPACING.sm,
    },
    joinBtn: {
      backgroundColor: colors.primary,
      borderRadius: RADIUS.lg,
      paddingVertical: SPACING.md,
      alignItems: "center",
      marginBottom: SPACING.lg,
      ...SHADOW.md,
    },
    joinBtnDisabled: {
      backgroundColor: colors.border,
    },
    joinBtnText: {
      fontSize: FONTSIZE.lg,
      fontFamily: FONTS.bold,
      color: colors.textWhite,
    },
    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: SPACING.lg,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      fontSize: FONTSIZE.sm,
      fontFamily: FONTS.regular,
      color: colors.textMuted,
      marginHorizontal: SPACING.sm,
    },
    recentCard: {
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
    recentLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: SPACING.sm,
    },
    recentIconCircle: {
      width: 42,
      height: 42,
      borderRadius: RADIUS.md,
      backgroundColor: colors.inputBg,
      alignItems: "center",
      justifyContent: "center",
    },
    recentIcon: { fontSize: 20 },
    recentName: {
      fontSize: FONTSIZE.md,
      fontFamily: FONTS.medium,
      color: colors.textPrimary,
    },
    recentMeta: {
      fontSize: FONTSIZE.xs,
      fontFamily: FONTS.regular,
      color: colors.textSecondary,
      marginTop: 2,
    },
    recentArrow: {
      fontSize: FONTSIZE.lg,
      color: colors.textMuted,
      fontFamily: FONTS.medium,
    },
  });
