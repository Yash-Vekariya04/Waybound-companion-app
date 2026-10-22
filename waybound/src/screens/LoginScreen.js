import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, ScrollView,
  Platform, StatusBar
} from "react-native";
import { FONTS, RADIUS, SPACING, FONTSIZE, SHADOW } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";

export default function LoginScreen({ navigation }) {
  const { isDark, colors } = useTheme();
  const s = makeStyles(colors);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── Logo & Headline ── */}
        <View style={s.heroSection}>
          <View style={s.logoCircle}>
            <Text style={s.logoEmoji}>🧭</Text>
          </View>
          <Text style={s.appName}>Waybound</Text>
          <Text style={s.tagline}>Ride together. Stay safe.</Text>
        </View>

        {/* ── Toggle ── */}
        <View style={s.toggleRow}>
          <TouchableOpacity
            style={[s.toggleBtn, isLogin && s.toggleActive]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[s.toggleText, isLogin && s.toggleTextActive]}>
              Log In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.toggleBtn, !isLogin && s.toggleActive]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[s.toggleText, !isLogin && s.toggleTextActive]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Form ── */}
        <View style={s.form}>
          {!isLogin && (
            <View style={s.inputWrapper}>
              <Text style={s.inputLabel}>Full Name</Text>
              <TextInput
                style={s.input}
                placeholder="Your name"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={s.inputWrapper}>
            <Text style={s.inputLabel}>Email</Text>
            <TextInput
              style={s.input}
              placeholder="you@email.com"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={s.inputWrapper}>
            <Text style={s.inputLabel}>Password</Text>
            <TextInput
              style={s.input}
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {isLogin && (
            <TouchableOpacity style={s.forgotBtn}>
              <Text style={s.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={s.primaryBtn}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={s.primaryBtnText}>
              {isLogin ? "Log In" : "Create Account"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Divider ── */}
        <View style={s.dividerRow}>
          <View style={s.dividerLine} />
          <Text style={s.dividerText}>or continue with</Text>
          <View style={s.dividerLine} />
        </View>

        {/* ── Social Buttons ── */}
        <View style={s.socialRow}>
          <TouchableOpacity style={s.socialBtn}>
            <Text style={s.socialIcon}>G</Text>
            <Text style={s.socialLabel}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.socialBtn}>
            <Text style={s.socialIcon}></Text>
            <Text style={s.socialLabel}>Apple</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.socialBtn}>
            <Text style={s.socialIcon}>𝕏</Text>
            <Text style={s.socialLabel}>X</Text>
          </TouchableOpacity>
        </View>

        {/* ── Guest Button ── */}
        <TouchableOpacity
          style={s.guestBtn}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={s.guestText}>Continue as Guest</Text>
        </TouchableOpacity>
        <Text style={s.guestDisclaimer}>
          Guest sessions are temporary. Your rooms and history won't be saved.
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = (colors) => StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl + 10,
    paddingBottom: SPACING.xxl,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.xl,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.sm,
    ...SHADOW.md,
  },
  logoEmoji: {
    fontSize: 36,
  },
  appName: {
    fontSize: FONTSIZE.huge,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.regular,
    color: colors.textSecondary,
    marginTop: SPACING.xs,
  },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: colors.inputBg,
    borderRadius: RADIUS.lg,
    padding: 4,
    marginBottom: SPACING.lg,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: "center",
  },
  toggleActive: {
    backgroundColor: colors.surface,
    ...SHADOW.sm,
  },
  toggleText: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.medium,
    color: colors.textSecondary,
  },
  toggleTextActive: {
    color: colors.primary,
    fontFamily: FONTS.bold,
  },
  form: {
    marginBottom: SPACING.lg,
  },
  inputWrapper: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: colors.textSecondary,
    marginBottom: SPACING.xs,
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
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: SPACING.md,
  },
  forgotText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: colors.primary,
  },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    ...SHADOW.md,
  },
  primaryBtnText: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: colors.textWhite,
    letterSpacing: 0.3,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
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
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  socialBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.xs,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    ...SHADOW.sm,
  },
  socialIcon: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: colors.textPrimary,
  },
  socialLabel: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: colors.textPrimary,
  },
  guestBtn: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: "dashed",
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.sm + 4,
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  guestText: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.medium,
    color: colors.primary,
  },
  guestDisclaimer: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: colors.textMuted,
    textAlign: "center",
    lineHeight: 16,
  },
});