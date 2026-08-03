import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { IRoutine, TimeOfDay } from '../../types';
import { Colors } from '../../constants/theme';

interface RoutineFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<IRoutine>) => Promise<void>;
  initialData?: IRoutine | null;
}

export const RoutineFormModal: React.FC<RoutineFormModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
}) => {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colors = Colors[scheme];

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Health');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [targetValue, setTargetValue] = useState('1');
  const [unit, setUnit] = useState('times');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setCategory(initialData.category || 'Health');
      setTimeOfDay(initialData.timeOfDay);
      setTargetValue(String(initialData.targetValue || 1));
      setUnit(initialData.unit || 'times');
    } else {
      setTitle('');
      setCategory('Health');
      setTimeOfDay('morning');
      setTargetValue('1');
      setUnit('times');
    }
    setError('');
  }, [initialData, visible]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Routine title is required');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        category: category.trim() || 'Health',
        timeOfDay,
        targetValue: Number(targetValue) || 1,
        unit: unit.trim() || 'times',
      });
      onClose();
    } catch (e: any) {
      setError(e.message || 'Failed to save routine');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={initialData ? 'Edit Habit Routine' : 'Create New Habit Routine'}
    >
      <Input
        label="Routine Title *"
        placeholder="e.g. Drink 8 glasses of water"
        value={title}
        onChangeText={setTitle}
        error={error}
      />
      <Input
        label="Category"
        placeholder="Health, Fitness, Mindfulness..."
        value={category}
        onChangeText={setCategory}
      />

      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Time Slot</Text>
      <View style={styles.segmentedRow}>
        {(['morning', 'afternoon', 'evening', 'night'] as TimeOfDay[]).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTimeOfDay(t)}
            style={[
              styles.segment,
              { backgroundColor: colors.cardHover, borderColor: colors.border },
              timeOfDay === t && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                { color: timeOfDay === t ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              {t.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inlineRow}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Input
            label="Daily Target Target"
            placeholder="1"
            keyboardType="numeric"
            value={targetValue}
            onChangeText={setTargetValue}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Input
            label="Unit"
            placeholder="times, mins, glasses"
            value={unit}
            onChangeText={setUnit}
          />
        </View>
      </View>

      <View style={styles.btnRow}>
        <Button
          title="Cancel"
          variant="secondary"
          onPress={onClose}
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button
          title={initialData ? 'Save Changes' : 'Create Routine'}
          variant="primary"
          onPress={handleSubmit}
          loading={loading}
          style={{ flex: 1 }}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  segmentedRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  segmentText: {
    fontSize: 11,
    fontWeight: '700',
  },
  inlineRow: {
    flexDirection: 'row',
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 12,
  },
});
