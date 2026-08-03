import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
} from 'react-native';
import { SymbolView } from 'expo-symbols';
import { useRoutineStore } from '../store/useRoutineStore';
import { Colors } from '../constants/theme';
import { RoutineItem } from '../components/routines/RoutineItem';
import { RoutineFormModal } from '../components/routines/RoutineFormModal';
import { IRoutine, TimeOfDay } from '../types';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';

export default function RoutinesScreen() {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colors = Colors[scheme];

  const {
    routines,
    selectedDate,
    loading,
    error,
    setSelectedDate,
    fetchRoutines,
    addRoutine,
    updateRoutine,
    toggleRoutineProgress,
    deleteRoutine,
  } = useRoutineStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<IRoutine | null>(null);

  useEffect(() => {
    fetchRoutines(selectedDate);
  }, [selectedDate]);

  const completedCount = routines.filter((r) => r.completedToday).length;
  const totalCount = routines.length;

  const handleOpenCreate = () => {
    setSelectedRoutine(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (routine: IRoutine) => {
    setSelectedRoutine(routine);
    setModalVisible(true);
  };

  const handleFormSubmit = async (data: Partial<IRoutine>) => {
    if (selectedRoutine) {
      await updateRoutine(selectedRoutine._id, data);
    } else {
      await addRoutine(data);
    }
  };

  const timeSlots: { key: TimeOfDay; label: string; icon: string }[] = [
    { key: 'morning', label: 'Morning Routines', icon: 'sun.max.fill' },
    { key: 'afternoon', label: 'Afternoon Routines', icon: 'sun.haze.fill' },
    { key: 'evening', label: 'Evening Routines', icon: 'sunset.fill' },
    { key: 'night', label: 'Night Routines', icon: 'moon.stars.fill' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={() => fetchRoutines(selectedDate)}
          tintColor={colors.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Daily Routine</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Target Habits & Daily Check-ins ({selectedDate})
          </Text>
        </View>

        <TouchableOpacity onPress={handleOpenCreate} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
          <SymbolView name="plus" size={18} tintColor="#FFFFFF" />
          <Text style={styles.addBtnText}>New Habit</Text>
        </TouchableOpacity>
      </View>

      {/* Daily Progress Card */}
      <Card style={styles.progressCard}>
        <Text style={[styles.progressTitle, { color: colors.text }]}>Today's Completion Goal</Text>
        <ProgressBar
          current={completedCount}
          target={totalCount || 1}
          unit="habits"
          color={colors.success}
        />
      </Card>

      {/* Categorized Time Slots */}
      {timeSlots.map((slot) => {
        const slotRoutines = routines.filter((r) => r.timeOfDay === slot.key);
        if (slotRoutines.length === 0) return null;

        return (
          <View key={slot.key} style={styles.slotSection}>
            <View style={styles.slotHeader}>
              <SymbolView name={slot.icon as any} size={18} tintColor={colors.warning} />
              <Text style={[styles.slotTitle, { color: colors.text }]}>{slot.label}</Text>
            </View>

            {slotRoutines.map((routine) => (
              <RoutineItem
                key={routine._id}
                routine={routine}
                onToggle={(id, completed) => toggleRoutineProgress(id, completed)}
                onEdit={handleOpenEdit}
                onDelete={deleteRoutine}
              />
            ))}
          </View>
        );
      })}

      {routines.length === 0 && !loading ? (
        <View style={styles.emptyBox}>
          <SymbolView name="repeat.circle" size={48} tintColor={colors.textMuted} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No daily routines configured yet.
          </Text>
        </View>
      ) : null}

      <RoutineFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedRoutine}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  progressCard: {
    padding: 16,
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  slotSection: {
    marginBottom: 16,
  },
  slotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  slotTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
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
