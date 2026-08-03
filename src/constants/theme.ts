export const Colors = {
  dark: {
    background: '#0B0F19',
    card: '#151C2C',
    cardHover: '#1E293B',
    border: '#2A364F',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    primary: '#3B82F6',
    primaryLight: '#60A5FA',
    accent: '#6366F1',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    purple: '#8B5CF6',
    cyan: '#06B6D4',
    backgroundSelected: '#1E293B',
    backgroundElement: '#151C2C',
  },
  light: {
    background: '#F8FAFC',
    card: '#FFFFFF',
    cardHover: '#F1F5F9',
    border: '#E2E8F0',
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    primary: '#2563EB',
    primaryLight: '#3B82F6',
    accent: '#4F46E5',
    success: '#059669',
    warning: '#D97706',
    danger: '#DC2626',
    purple: '#7C3AED',
    cyan: '#0891B2',
    backgroundSelected: '#E2E8F0',
    backgroundElement: '#F1F5F9',
  },
};

export type ThemeType = 'dark' | 'light';
export type ThemeColor = keyof typeof Colors.dark;

export const PriorityColors = {
  high: { bg: '#EF444420', text: '#EF4444', border: '#EF444440' },
  medium: { bg: '#F59E0B20', text: '#F59E0B', border: '#F59E0B40' },
  low: { bg: '#10B98120', text: '#10B981', border: '#10B98140' },
};

export const Spacing = {
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
};

export const MaxContentWidth = 1200;
export const BottomTabInset = 60;

export const Fonts = {
  regular: 'System',
  bold: 'System',
  semiBold: 'System',
};
