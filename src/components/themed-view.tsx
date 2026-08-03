import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Colors } from '@/constants/theme';

export type ThemedViewProps = ViewProps & {
  type?: keyof typeof Colors.dark;
};

export function ThemedView({ style, type = 'card', ...otherProps }: ThemedViewProps) {
  const theme = useTheme();
  const backgroundColor = theme[type] || theme.card;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
