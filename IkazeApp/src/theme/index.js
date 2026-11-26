// Theme — Rwanda-inspired color palette
export const COLORS = {
  primary: '#00A551',       // Rwanda flag green
  primaryDark: '#007A3D',
  primaryLight: '#E8F8EE',
  secondary: '#FFD700',     // Rwanda flag yellow
  accent: '#1A56A0',        // Rwanda flag blue
  danger: '#C0392B',
  background: '#F7F9F7',
  card: '#FFFFFF',
  surface: '#F0F4F0',
  textPrimary: '#1A2E1A',
  textSecondary: '#5A6E5A',
  textMuted: '#9EB09E',
  textOnPrimary: '#FFFFFF',
  border: '#D8E8D8',
  shadow: 'rgba(0,0,0,0.08)',
  overlay: 'rgba(0,0,0,0.5)',
};

export const FONTS = {
  sizes: {
    xs: 11, sm: 13, md: 15, lg: 17, xl: 20, xxl: 26, hero: 34,
  },
  weights: {
    regular: '400', medium: '500', semibold: '600', bold: '700', heavy: '800',
  },
};

export const SPACING = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const RADIUS = {
  sm: 8, md: 12, lg: 16, xl: 24, full: 999,
};

export const SHADOW = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};

export const CATEGORY_COLORS = {
  'National Park':          { bg: '#E8F8EE', text: '#007A3D', icon: '🌿' },
  'Lake & Water':           { bg: '#E8F3FF', text: '#1A56A0', icon: '💧' },
  'Waterfall':              { bg: '#EBF6FF', text: '#0575B6', icon: '💦' },
  'Museum':                 { bg: '#FFF8E8', text: '#B07800', icon: '🏛️' },
  'Genocide Memorial':      { bg: '#FFF0F0', text: '#8B1A1A', icon: '🕊️' },
  'Cultural Site':          { bg: '#F5EEFF', text: '#6B2FA0', icon: '🎭' },
  'Religious & Pilgrimage': { bg: '#FFF9E8', text: '#8B6914', icon: '⛪' },
  'Adventure & Eco':        { bg: '#E8FFEE', text: '#00693E', icon: '🚵' },
  'City Attraction':        { bg: '#F0F4FF', text: '#2D3A8C', icon: '🏙️' },
};
