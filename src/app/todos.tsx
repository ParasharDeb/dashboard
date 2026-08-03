import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
} from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useTodoStore } from '../store/useTodoStore';
import { Colors } from '../constants/theme';
import { TodoItem } from '../components/todos/TodoItem';
import { TodoFilterBar } from '../components/todos/TodoFilterBar';
import { TodoFormModal } from '../components/todos/TodoFormModal';
import { ITodo } from '../types';
import { Button } from '../components/ui/Button';

export default function TodosScreen() {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colors = Colors[scheme];

  const {
    todos,
    loading,
    error,
    filters,
    setFilters,
    fetchTodos,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
  } = useTodoStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<ITodo | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleOpenCreate = () => {
    setSelectedTodo(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (todo: ITodo) => {
    setSelectedTodo(todo);
    setModalVisible(true);
  };

  const handleFormSubmit = async (data: Partial<ITodo>) => {
    if (selectedTodo) {
      await updateTodo(selectedTodo._id, data);
    } else {
      await addTodo(data);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Todo Tasks</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {todos.length} task{todos.length === 1 ? '' : 's'} listed
          </Text>
        </View>

        <TouchableOpacity onPress={handleOpenCreate} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
          <SymbolView name="plus" size={18} tintColor="#FFFFFF" />
          <Text style={styles.addBtnText}>New Task</Text>
        </TouchableOpacity>
      </View>

      {/* Filter & Search Bar */}
      <TodoFilterBar
        statusFilter={filters.status || 'all'}
        priorityFilter={filters.priority || 'all'}
        searchQuery={filters.search || ''}
        onStatusChange={(status) => setFilters({ status })}
        onPriorityChange={(priority) => setFilters({ priority })}
        onSearchChange={(search) => setFilters({ search })}
      />

      {/* Todo List */}
      <FlatList
        data={todos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TodoItem
            todo={item}
            onToggle={toggleTodo}
            onEdit={handleOpenEdit}
            onDelete={deleteTodo}
          />
        )}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchTodos} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyBox}>
              <SymbolView name="checkmark.circle" size={48} tintColor={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No todo tasks found matching criteria.
              </Text>
              <Button
                title="Create New Task"
                variant="secondary"
                size="sm"
                onPress={handleOpenCreate}
                style={{ marginTop: 12 }}
              />
            </View>
          ) : null
        }
      />

      {/* Todo Create / Edit Modal */}
      <TodoFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedTodo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 6,
  },
  listContainer: {
    paddingBottom: 40,
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
  },
});
