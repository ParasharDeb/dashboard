import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet, useColorScheme } from 'react-native';
import { Input } from '../ui/Input';
import { SymbolView } from 'expo-symbols';
import { Colors } from '../../constants/theme';

interface TodoFilterBarProps {
  statusFilter: string;
  priorityFilter: string;
  searchQuery: string;
  onStatusChange: (status: string) => void;
  onPriorityChange: (priority: string) => void;
  onSearchChange: (query: string) => void;
}

export const TodoFilterBar: React.FC<TodoFilterBarProps> = ({
  statusFilter,
  priorityFilter,
  searchQuery,
  onStatusChange,
  onPriorityChange,
  onSearchChange,
}) => {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colors = Colors[scheme];

  const statuses = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Completed', value: 'completed' },
  ];

  const priorities = [
    { label: 'All Priorities', value: 'all' },
    { label: 'High', value: 'high' },
    { label: 'Medium', value: 'medium' },
    { label: 'Low', value: 'low' },
  ];

  return (
    <View style={styles.container}>
      <Input
        placeholder="Search tasks by title or tag..."
        value={searchQuery}
        onChangeText={onSearchChange}
        icon={<SymbolView name="magnifyingglass" size={18} tintColor={colors.textMuted} />}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {statuses.map((s) => (
          <TouchableOpacity
            key={s.value}
            onPress={() => onStatusChange(s.value)}
            style={[
              styles.chip,
              { backgroundColor: colors.cardHover, borderColor: colors.border },
              statusFilter === s.value && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: statusFilter === s.value ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
        {priorities.map((p) => (
          <TouchableOpacity
            key={`p_${p.value}`}
            onPress={() => onPriorityChange(p.value)}
            style={[
              styles.chip,
              { backgroundColor: colors.cardHover, borderColor: colors.border },
              priorityFilter === p.value && { backgroundColor: colors.purple, borderColor: colors.purple },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: priorityFilter === p.value ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scroll: {
    flexDirection: 'row',
    marginTop: 4,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
