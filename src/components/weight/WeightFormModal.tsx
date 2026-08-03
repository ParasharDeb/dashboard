import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { IWeightLog } from '../../types';
import { Colors } from '../../constants/theme';

interface WeightFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<IWeightLog>) => Promise<void>;
  initialData?: IWeightLog | null;
}

export const WeightFormModal: React.FC<WeightFormModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
}) => {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colors = Colors[scheme];

  const todayStr = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(todayStr);
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setDate(initialData.date);
      setWeight(String(initialData.weight));
      setUnit(initialData.unit || 'kg');
      setNotes(initialData.notes || '');
    } else {
      setDate(todayStr);
      setWeight('');
      setUnit('kg');
      setNotes('');
    }
    setError('');
  }, [initialData, visible]);

  const handleSubmit = async () => {
    if (!weight || Number(weight) <= 0) {
      setError('Please enter a valid weight');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        date,
        weight: Number(weight),
        unit,
        notes: notes.trim(),
      });
      onClose();
    } catch (e: any) {
      setError(e.message || 'Failed to log weight');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={initialData ? 'Edit Weight Log' : 'Log Daily Body Weight'}
    >
      <Input
        label="Date (YYYY-MM-DD) *"
        placeholder="YYYY-MM-DD"
        value={date}
        onChangeText={setDate}
      />

      <View style={styles.inlineRow}>
        <View style={{ flex: 2, marginRight: 8 }}>
          <Input
            label="Weight Amount *"
            placeholder="e.g. 78.5"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
            error={error}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Unit</Text>
          <View style={styles.segmentedRow}>
            {(['kg', 'lbs'] as ('kg' | 'lbs')[]).map((u) => (
              <TouchableOpacity
                key={u}
                onPress={() => setUnit(u)}
                style={[
                  styles.segment,
                  { backgroundColor: colors.cardHover, borderColor: colors.border },
                  unit === u && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: unit === u ? '#FFFFFF' : colors.textSecondary },
                  ]}
                >
                  {u.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <Input
        label="Notes / Time (Optional)"
        placeholder="e.g. Logged morning after workout..."
        value={notes}
        onChangeText={setNotes}
      />

      <View style={styles.btnRow}>
        <Button
          title="Cancel"
          variant="secondary"
          onPress={onClose}
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button
          title={initialData ? 'Save Changes' : 'Log Weight'}
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
    marginTop: 8,
    marginBottom: 6,
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  segmentedRow: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
  },
  segment: {
    flex: 1,
    height: '100%',
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 2,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 12,
  },
});
