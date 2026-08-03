import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { INutritionLog } from '../../types';
import { Colors } from '../../constants/theme';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface MealLogItemProps {
  log: INutritionLog;
  onEdit: (log: INutritionLog) => void;
  onDelete: (id: string) => void;
}

export const MealLogItem: React.FC<MealLogItemProps> = ({ log, onEdit, onDelete }) => {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colors = Colors[scheme];

  const mealColors: Record<string, string> = {
    breakfast: colors.warning,
    lunch: colors.primary,
    dinner: colors.purple,
    snack: colors.cyan,
  };

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Badge
              label={log.mealType}
              size="sm"
              color={mealColors[log.mealType] || colors.primary}
              backgroundColor={`${mealColors[log.mealType] || colors.primary}15`}
              borderColor={`${mealColors[log.mealType] || colors.primary}30`}
            />
            <Text style={[styles.foodName, { color: colors.text }]}>{log.foodName}</Text>
          </View>

          <View style={styles.statsRow}>
            <Text style={[styles.statText, { color: colors.textSecondary }]}>
              🔥 <Text style={{ color: colors.text, fontWeight: '700' }}>{log.calories}</Text> kcal
            </Text>
            <Text style={[styles.statText, { color: colors.textSecondary }]}>
              🥩 <Text style={{ color: colors.text, fontWeight: '700' }}>{log.protein}</Text>g protein
            </Text>
            {log.carbs > 0 && (
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                🍞 {log.carbs}g carbs
              </Text>
            )}
            {log.fat > 0 && (
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                🥑 {log.fat}g fat
              </Text>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onEdit(log)} style={styles.actionBtn}>
            <SymbolView name="pencil" size={16} tintColor={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(log._id)} style={styles.actionBtn}>
            <SymbolView name="trash" size={16} tintColor={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  foodName: {
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  statText: {
    fontSize: 12,
    marginRight: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 6,
    marginLeft: 4,
  },
});
