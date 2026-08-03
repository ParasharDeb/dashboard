import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, ViewStyle } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { ITodo } from '../../types';
import { Colors, PriorityColors } from '../../constants/theme';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface TodoItemProps {
  todo: ITodo;
  onToggle: (id: string) => void;
  onEdit: (todo: ITodo) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onEdit, onDelete }) => {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colors = Colors[scheme];
  const isCompleted = todo.status === 'completed';
  const priorityStyle = PriorityColors[todo.priority] || PriorityColors.medium;

  const cardStyle: ViewStyle = isCompleted ? { opacity: 0.6 } : {};

  return (
    <Card style={{ ...styles.card, ...cardStyle }}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => onToggle(todo._id)}
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
            {todo.title}
          </Text>
          {todo.description ? (
            <Text style={[styles.desc, { color: colors.textSecondary }]} numberOfLines={2}>
              {todo.description}
            </Text>
          ) : null}

          <View style={styles.tagsRow}>
            <Badge
              label={todo.priority}
              size="sm"
              color={priorityStyle.text}
              backgroundColor={priorityStyle.bg}
              borderColor={priorityStyle.border}
            />
            {todo.category ? (
              <Badge
                label={todo.category}
                size="sm"
                color={colors.primary}
                backgroundColor={`${colors.primary}15`}
                borderColor={`${colors.primary}30`}
                style={{ marginLeft: 6 }}
              />
            ) : null}
            {todo.dueDate ? (
              <Text style={[styles.dueDate, { color: colors.textMuted }]}>
                📅 {new Date(todo.dueDate).toLocaleDateString()}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onEdit(todo)} style={styles.actionBtn}>
            <SymbolView name="pencil" size={16} tintColor={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(todo._id)} style={styles.actionBtn}>
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
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  desc: {
    fontSize: 13,
    marginBottom: 6,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  dueDate: {
    fontSize: 11,
    marginLeft: 8,
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
