import React from 'react';
import { View, Text, StyleSheet, Dimensions, useColorScheme } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { IWeightLog } from '../../types';
import { Colors } from '../../constants/theme';
import { Card } from '../ui/Card';

interface WeightChartProps {
  logs: IWeightLog[];
  unit?: string;
}

export const WeightChart: React.FC<WeightChartProps> = ({ logs, unit = 'kg' }) => {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colors = Colors[scheme];
  const screenWidth = Dimensions.get('window').width - 40;

  if (!logs || logs.length === 0) {
    return (
      <Card style={styles.emptyCard}>
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          No weight entries logged for this period yet.
        </Text>
      </Card>
    );
  }

  // Format chart labels (e.g. "08/01")
  const recentLogs = logs.slice(-7); // display max 7 data points on chart for readability
  const labels = recentLogs.map((l) => {
    const parts = l.date.split('-');
    return parts.length === 3 ? `${parts[1]}/${parts[2]}` : l.date;
  });
  const dataPoints = recentLogs.map((l) => l.weight);

  const chartConfig = {
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => colors.textSecondary,
    strokeWidth: 3,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForDots: {
      r: '5',
      strokeWidth: '2',
      stroke: colors.primary,
    },
    propsForBackgroundLines: {
      stroke: colors.border,
      strokeDasharray: '4',
    },
  };

  return (
    <Card style={styles.chartCard}>
      <Text style={[styles.chartTitle, { color: colors.text }]}>Body Weight Trend ({unit})</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels,
            datasets: [{ data: dataPoints }],
          }}
          width={Math.max(screenWidth, 300)}
          height={200}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    padding: 12,
    marginVertical: 8,
    alignItems: 'center',
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '700',
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginLeft: 4,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: 12,
  },
  chart: {
    borderRadius: 12,
    paddingRight: 35,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
