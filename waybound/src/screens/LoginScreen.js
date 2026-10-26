import { registerForPushNotifications } from "../utils/notifications";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FONTS, RADIUS, SPACING, FONTSIZE, SHADOW } from "../constants/theme";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { loginUser, registerUser, savePushToken } from "../services/api";

export default function LoginScreen({ navigation }) {
  const { isDark, colors } = useTheme();
  const { saveSession } = useAuth();
  const s = makeStyles(colors);

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }
    if (!isLogin && !name.trim()) {
      Alert.alert("Missing fields", "Please enter your name.");
      return;
    }

    setLoading(true);
    try {
      let result;
      if (isLogin) {
        result = await loginUser({ email: email.trim(), password });
      } else {
        result = await registerUser({
          name: name.trim(),
          email: email.trim(),
          password,
        });
      }

      await saveSession(result.user, result.token);
      // Register for push notifications safely
      try {
        const pushToken = await registerForPushNotifications();
        if (pushToken) {
          await savePushToken(pushToken);
          console.log("✅ Push token saved");
        } else {
          console.log("ℹ️ No push token (Expo Go limitation)");
        }
      } catch (e) {
        // Never let push token errors block login
        console.log("ℹ️ Push token skipped:", e.message);
      }
      navigation.replace("MainTabs");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={s.root}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <View style={s.container}>
        {/* ── Logo ── */}
        <View style={s.logoArea}>
          <Text style={s.logoIcon}>🧭</Text>
          <Text style={s.logoText}>Waybound</Text>
          <Text style={s.logoSub}>Ride together. Stay connected.</Text>
        </View>

        {/* ── Tab Toggle ── */}
        <View style={s.tabRow}>
          <TouchableOpacity
            style={[s.tab, isLogin && s.tabActive]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[s.tabText, isLogin && s.tabTextActive]}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.tab, !isLogin && s.tabActive]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[s.tabText, !isLogin && s.tabTextActive]}>
              Register
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Form ── */}
        <View style={s.form}>
          {!isLogin && (
            <TextInput
              style={s.input}
              placeholder="Your name"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />
          )}
          <TextInput
            style={s.input}
            placeholder="Email address"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={s.input}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={[s.submitBtn, loading && s.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.textWhite} />
            ) : (
              <Text style={s.submitBtnText}>
                {isLogin ? "Log In" : "Create Account"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const makeStyles = (colors) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: colors.background },
    container: {
      flex: 1,
      paddingHorizontal: SPACING.lg,
      justifyContent: "center",
    },
    logoArea: {
      alignItems: "center",
      marginBottom: SPACING.xxl,
    },
    logoIcon: { fontSize: 52 },
    logoText: {
      fontSize: FONTSIZE.xxl,
      fontFamily: FONTS.bold,
      color: colors.textPrimary,
      marginTop: SPACING.sm,
    },
    logoSub: {
      fontSize: FONTSIZE.sm,
      fontFamily: FONTS.regular,
      color: colors.textSecondary,
      marginTop: SPACING.xs,
    },
    tabRow: {
      flexDirection: "row",
      backgroundColor: colors.inputBg,
      borderRadius: RADIUS.lg,
      padding: 4,
      marginBottom: SPACING.lg,
    },
    tab: {
      flex: 1,
      paddingVertical: SPACING.sm,
      alignItems: "center",
      borderRadius: RADIUS.md,
    },
    tabActive: {
      backgroundColor: colors.surface,
      ...SHADOW.sm,
    },
    tabText: {
      fontSize: FONTSIZE.md,
      fontFamily: FONTS.medium,
      color: colors.textSecondary,
    },
    tabTextActive: {
      color: colors.primary,
      fontFamily: FONTS.bold,
    },
    form: { gap: SPACING.md },
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
    submitBtn: {
      backgroundColor: colors.primary,
      borderRadius: RADIUS.lg,
      paddingVertical: SPACING.md,
      alignItems: "center",
      marginTop: SPACING.sm,
      ...SHADOW.md,
    },
    submitBtnDisabled: { opacity: 0.6 },
    submitBtnText: {
      fontSize: FONTSIZE.lg,
      fontFamily: FONTS.bold,
      color: colors.textWhite,
    },
  });
