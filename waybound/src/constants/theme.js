export const COLORS = {
  primary:   "#0a8f7f",
  secondary: "#2ecc71",
  alert:     "#f39c12",
  danger:    "#e74c3c",
  background: "#fafaf9",
  surface:    "#ffffff",
  border:     "#e8e8e5",
  inputBg:    "#f2f2f0",
  textPrimary:   "#1a1a1a",
  textSecondary: "#9e9e9e",
  textMuted:     "#bbb",
  textWhite:     "#ffffff",
  darkBg:      "#121212",
  darkSurface: "#1e1e1e",
  darkBorder:  "#2c2c2c",
  darkText:    "#f0f0f0",
};

export const FONTS = {
  regular: "DMSans_400Regular",
  medium:  "DMSans_500Medium",
  bold:    "DMSans_700Bold",
};

export const RADIUS = { sm: 8, md: 12, lg: 16, xl: 24, full: 999 };
export const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 40 };
export const FONTSIZE = { xs: 11, sm: 12, md: 14, lg: 16, xl: 18, xxl: 22, huge: 26 };

export const SHADOW = {
  sm: { shadowColor:"#000", shadowOffset:{width:0,height:1}, shadowOpacity:0.06, shadowRadius:4,  elevation:2 },
  md: { shadowColor:"#000", shadowOffset:{width:0,height:4}, shadowOpacity:0.08, shadowRadius:8,  elevation:4 },
  lg: { shadowColor:"#000", shadowOffset:{width:0,height:8}, shadowOpacity:0.10, shadowRadius:16, elevation:8 },
};

// ── Theme resolver — call this with isDark to get the right colors ──
export const getThemeColors = (isDark) => ({
  primary:       COLORS.primary,
  secondary:     COLORS.secondary,
  danger:        COLORS.danger,
  alert:         COLORS.alert,
  textWhite:     COLORS.textWhite,
  background:    isDark ? COLORS.darkBg      : COLORS.background,
  surface:       isDark ? COLORS.darkSurface  : COLORS.surface,
  border:        isDark ? COLORS.darkBorder   : COLORS.border,
  inputBg:       isDark ? "#2a2a2a"           : COLORS.inputBg,
  textPrimary:   isDark ? COLORS.darkText     : COLORS.textPrimary,
  textSecondary: isDark ? "#aaaaaa"           : COLORS.textSecondary,
  textMuted:     isDark ? "#555555"           : COLORS.textMuted,
});