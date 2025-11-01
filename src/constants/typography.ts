import { TextStyle, Platform } from 'react-native';

// Font family definitions
export const fontFamily = {
  heading: Platform.select({
    ios: 'SF Pro Display',
    android: 'Inter',
    default: 'System',
  }) as TextStyle['fontFamily'],
  body: Platform.select({
    ios: 'SF Pro Text',
    android: 'Inter',
    default: 'System',
  }) as TextStyle['fontFamily'],
} as const;

// Font weight definitions
export const fontWeight = {
  heading: '700' as TextStyle['fontWeight'], // Bold for headings
  medium: '500' as TextStyle['fontWeight'],
  regular: '400' as TextStyle['fontWeight'],
} as const;

// Font size definitions
export const fontSize = {
  h3: 32,
  h6: 20,
  body: 16,
  caption: 12,
} as const;

// Line height definitions
export const lineHeight = {
  h3: 40,
  h6: 28,
  body: 24,
  caption: 16,
} as const;

// Letter spacing definitions
export const letterSpacing = {
  h3: -0.5,
  h6: -0.4,
  body: 0,
  caption: 0,
} as const;

export const typography = {
  h3: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h3,
    fontWeight: fontWeight.heading,
    lineHeight: lineHeight.h3,
    letterSpacing: letterSpacing.h3,
  },
  h6: {
    fontFamily: fontFamily.heading,
    fontSize: fontSize.h6,
    fontWeight: fontWeight.heading,
    lineHeight: lineHeight.h6,
    letterSpacing: letterSpacing.h6,
  },
  body: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.body,
    letterSpacing: letterSpacing.body,
  },
  bodyMedium: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.body,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.body,
    letterSpacing: letterSpacing.body,
  },
  caption: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.caption,
    letterSpacing: letterSpacing.caption,
  },
} as const;

