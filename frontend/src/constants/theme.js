// Unified Design System for GovIntel Platform
// Inspired by Stripe, Linear, Vercel design principles

export const COLORS = {
  // Primary Brand Color
  primary: {
    DEFAULT: "#2563EB",
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#3B82F6",
    600: "#2563EB",
    700: "#1D4ED8",
    800: "#1E40AF",
    900: "#1E3A8A",
    950: "#172554",
  },

  // Secondary Color
  secondary: {
    DEFAULT: "#0F172A",
    50: "#F8FAFC",
    100: "#F1F5F9",
    200: "#E2E8F0",
    300: "#CBD5E1",
    400: "#94A3B8",
    500: "#64748B",
    600: "#475569",
    700: "#334155",
    800: "#1E293B",
    900: "#0F172A",
    950: "#020617",
  },

  // Accent Color
  accent: {
    DEFAULT: "#8B5CF6",
    50: "#F5F3FF",
    100: "#EDE9FE",
    200: "#DDD6FE",
    300: "#C4B5FD",
    400: "#A78BFA",
    500: "#8B5CF6",
    600: "#7C3AED",
    700: "#6D28D9",
    800: "#5B21B6",
    900: "#4C1D95",
    950: "#2E1065",
  },

  // Semantic Colors
  success: {
    DEFAULT: "#22C55E",
    50: "#F0FDF4",
    100: "#DCFCE7",
    200: "#BBF7D0",
    300: "#86EFAC",
    400: "#4ADE80",
    500: "#22C55E",
    600: "#16A34A",
    700: "#15803D",
    800: "#166534",
    900: "#14532D",
  },

  warning: {
    DEFAULT: "#F59E0B",
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    400: "#FBBF24",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
    800: "#92400E",
    900: "#78350F",
  },

  danger: {
    DEFAULT: "#EF4444",
    50: "#FEF2F2",
    100: "#FEE2E2",
    200: "#FECACA",
    300: "#FCA5A5",
    400: "#F87171",
    500: "#EF4444",
    600: "#DC2626",
    700: "#B91C1C",
    800: "#991B1B",
    900: "#7F1D1D",
  },

  // Neutral Colors
  background: "#F8FAFC",
  surface: "#FFFFFF",
  surfaceAlt: "#F1F5F9",

  // Text Colors
  text: {
    primary: "#0F172A",
    secondary: "#475569",
    tertiary: "#64748B",
    muted: "#94A3B8",
  },

  // Border Colors
  border: {
    DEFAULT: "#E2E8F0",
    light: "#F1F5F9",
    dark: "#CBD5E1",
  },
};

// Spacing System (8px Grid)
export const SPACING = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
  32: "128px",
};

// Border Radius
export const BORDER_RADIUS = {
  none: "0px",
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "20px",
  "3xl": "24px",
  full: "9999px",
};

// Shadow System
export const SHADOWS = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  DEFAULT: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
  glow: "0 0 20px rgba(37, 99, 235, 0.15)",
};

// Typography Scale
export const TYPOGRAPHY = {
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },

  fontSize: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
    "3xl": "30px",
    "4xl": "36px",
    "5xl": "48px",
    "6xl": "60px",
  },

  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },

  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75",
  },
};

// Container Widths
export const CONTAINER = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
};

// Transition
export const TRANSITION = {
  DEFAULT: "all 0.2s ease-in-out",
  fast: "all 0.15s ease-in-out",
  slow: "all 0.3s ease-in-out",
};

// Z-Index Scale
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
};