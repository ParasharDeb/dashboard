import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Colors } from '../../constants/theme';

interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  unit?: string;
  color?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  label,
  unit = '',
  color = '#3B82F6',
  showPercentage = true,
}) => {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colors = Colors[scheme];

  const percentage = Math.min(Math.round((current / (target || 1)) * 100), 100);

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.header}>
          <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
          <Text style={[styles.value, { color: colors.textSecondary }]}>
            {current} / {target} {unit} {showPercentage ? `(${percentage}%)` : ''}
          </Text>
        </View>
      )}
      <View style={[styles.track, { backgroundColor: colors.cardHover }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${percentage}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 6,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    fontSize: 13,
  },
  track: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
});
