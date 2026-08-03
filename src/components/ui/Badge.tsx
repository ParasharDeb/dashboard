import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface BadgeProps {
  label: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  color = '#3B82F6',
  backgroundColor = '#3B82F620',
  borderColor = '#3B82F640',
  size = 'md',
  style,
}) => {
  const isSm = size === 'sm';
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor,
          borderColor,
          paddingVertical: isSm ? 2 : 4,
          paddingHorizontal: isSm ? 6 : 10,
        },
        style,
      ]}
    >
      <Text style={[styles.text, { color, fontSize: isSm ? 11 : 13 }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
