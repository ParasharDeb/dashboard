import { Text, type TextProps, StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Colors } from '@/constants/theme';

export type ThemedTextProps = TextProps & {
  themeColor?: keyof typeof Colors.dark;
  type?:
    | 'default'
    | 'title'
    | 'defaultSemiBold'
    | 'subtitle'
    | 'link'
    | 'linkPrimary'
    | 'small'
    | 'smallBold'
    | 'code';
};

export function ThemedText({
  style,
  themeColor = 'text',
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const theme = useTheme();
  const color = theme[themeColor] || theme.text;

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'linkPrimary' ? styles.linkPrimary : undefined,
        type === 'small' ? styles.small : undefined,
        type === 'smallBold' ? styles.smallBold : undefined,
        type === 'code' ? styles.code : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: 16,
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
  },
  smallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 'bold',
  },
  code: {
    fontFamily: 'PlatformFont',
  },
});
