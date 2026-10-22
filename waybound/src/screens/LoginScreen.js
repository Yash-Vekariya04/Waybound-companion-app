import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, ScrollView,
  Platform, StatusBar
} from "react-native";
import { COLORS, FONTS, RADIUS, SPACING, FONTSIZE, SHADOW } from "../constants/theme";

export default function LoginScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* ── Logo & Headline ── */}
        <View style={styles.heroSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🧭</Text>
          </View>
          <Text style={styles.appName}>Waybound</Text>
          <Text style={styles.tagline}>Ride together. Stay safe.</Text>
        </View>

        {/* ── Toggle: Login / Sign Up ── */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, isLogin && styles.toggleActive]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[styles.toggleText, isLogin && styles.toggleTextActive]}>
              Log In
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, !isLogin && styles.toggleActive]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[styles.toggleText, !isLogin && styles.toggleTextActive]}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Form ── */}
        <View style={styles.form}>
          {!isLogin && (
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your name"
                placeholderTextColor={COLORS.textMuted}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@email.com"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {isLogin && (
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          {/* Primary CTA */}
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.primaryBtnText}>
              {isLogin ? "Log In" : "Create Account"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Divider ── */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* ── Social Buttons ── */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn}>
            <Text style={styles.socialIcon}>G</Text>
            <Text style={styles.socialLabel}>Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <Text style={styles.socialIcon}></Text>
            <Text style={styles.socialLabel}>Apple</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <Text style={styles.socialIcon}>𝕏</Text>
            <Text style={styles.socialLabel}>X</Text>
          </TouchableOpacity>
        </View>

        {/* ── Guest Button ── */}
        <TouchableOpacity
          style={styles.guestBtn}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>
        <Text style={styles.guestDisclaimer}>
          Guest sessions are temporary. Your rooms and history won't be saved.
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl + 10,
    paddingBottom: SPACING.xxl,
  },

  // Hero
  heroSection: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.surface,
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
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },

  // Toggle
  toggleRow: {
    flexDirection: "row",
    backgroundColor: COLORS.inputBg,
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
    backgroundColor: COLORS.surface,
    ...SHADOW.sm,
  },
  toggleText: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  toggleTextActive: {
    color: COLORS.primary,
    fontFamily: FONTS.bold,
  },

  // Form
  form: {
    marginBottom: SPACING.lg,
  },
  inputWrapper: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
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
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: SPACING.md,
  },
  forgotText: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.md,
    alignItems: "center",
    ...SHADOW.md,
  },
  primaryBtnText: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textWhite,
    letterSpacing: 0.3,
  },

  // Divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
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

  // Social
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
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.sm + 2,
    ...SHADOW.sm,
  },
  socialIcon: {
    fontSize: FONTSIZE.lg,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
  },
  socialLabel: {
    fontSize: FONTSIZE.sm,
    fontFamily: FONTS.medium,
    color: COLORS.textPrimary,
  },

  // Guest
  guestBtn: {
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: "dashed",
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.sm + 4,
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  guestText: {
    fontSize: FONTSIZE.md,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  guestDisclaimer: {
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.regular,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 16,
  },
});