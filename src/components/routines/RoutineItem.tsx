import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, ViewStyle } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { IRoutine } from '../../types';
import { Colors } from '../../constants/theme';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface RoutineItemProps {
  routine: IRoutine;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (routine: IRoutine) => void;
  onDelete: (id: string) => void;
}

export const RoutineItem: React.FC<RoutineItemProps> = ({
  routine,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colors = Colors[scheme];
  const isCompleted = Boolean(routine.completedToday);

  const timeIcons: Record<string, any> = {
    morning: 'sun.max.fill',
    afternoon: 'sun.haze.fill',
    evening: 'sunset.fill',
    night: 'moon.stars.fill',
  };

  const cardStyle: ViewStyle = isCompleted ? { opacity: 0.7 } : {};

  return (
    <Card style={{ ...styles.card, ...cardStyle }}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => onToggle(routine._id, !isCompleted)}
          style={[
            styles.checkbox,
            { borderColor: isCompleted ? colors.success : colors.border },
            isCompleted ? { backgroundColor: colors.success } : null,
          ]}
        >
          {isCompleted && <SymbolView name="checkmark" size={14} tintColor="#FFFFFF" />}
        </TouchableOpacity>

        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              { color: colors.text },
              isCompleted ? { textDecorationLine: 'line-through', color: colors.textMuted } : null,
            ]}
          >
            {routine.title}
          </Text>

          <View style={styles.metaRow}>
            <SymbolView
              name={timeIcons[routine.timeOfDay] || 'sun.max.fill'}
              size={14}
              tintColor={colors.warning}
            />
            <Text style={[styles.timeText, { color: colors.textSecondary }]}>
              {routine.timeOfDay.toUpperCase()}
            </Text>

            <Badge
              label={`${routine.targetValue} ${routine.unit}`}
              size="sm"
              color={colors.cyan}
              backgroundColor={`${colors.cyan}15`}
              borderColor={`${colors.cyan}30`}
              style={{ marginLeft: 8 }}
            />
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onEdit(routine)} style={styles.actionBtn}>
            <SymbolView name="pencil" size={16} tintColor={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(routine._id)} style={styles.actionBtn}>
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
    padding: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionBtn: {
    padding: 6,
    marginLeft: 4,
  },
});
