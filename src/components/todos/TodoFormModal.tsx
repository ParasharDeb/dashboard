import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ITodo, PriorityLevel, TodoStatus } from '../../types';
import { Colors } from '../../constants/theme';

interface TodoFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<ITodo>) => Promise<void>;
  initialData?: ITodo | null;
}

export const TodoFormModal: React.FC<TodoFormModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
}) => {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colors = Colors[scheme];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [status, setStatus] = useState<TodoStatus>('pending');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setPriority(initialData.priority);
      setStatus(initialData.status);
      setCategory(initialData.category || 'General');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('pending');
      setCategory('General');
    }
    setError('');
  }, [initialData, visible]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        category: category.trim() || 'General',
      });
      onClose();
    } catch (e: any) {
      setError(e.message || 'Failed to save todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={initialData ? 'Edit Todo Task' : 'Create New Todo Task'}
    >
      <Input
        label="Task Title *"
        placeholder="e.g. Complete quarterly report"
        value={title}
        onChangeText={setTitle}
        error={error}
      />
      <Input
        label="Description (Optional)"
        placeholder="Add extra notes or links..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
      />
      <Input
        label="Category"
        placeholder="Work, Personal, Fitness, etc."
        value={category}
        onChangeText={setCategory}
      />

      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Priority Level</Text>
      <View style={styles.segmentedRow}>
        {(['low', 'medium', 'high'] as PriorityLevel[]).map((p) => (
          <TouchableOpacity
            key={p}
            onPress={() => setPriority(p)}
            style={[
              styles.segment,
              { backgroundColor: colors.cardHover, borderColor: colors.border },
              priority === p && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                { color: priority === p ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              {p.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {initialData && (
        <>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Status</Text>
          <View style={styles.segmentedRow}>
            {(['pending', 'in_progress', 'completed'] as TodoStatus[]).map((s) => (
              <TouchableOpacity
                key={s}
                onPress={() => setStatus(s)}
                style={[
                  styles.segment,
                  { backgroundColor: colors.cardHover, borderColor: colors.border },
                  status === s && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    { color: status === s ? '#FFFFFF' : colors.textSecondary },
                  ]}
                >
                  {s.replace('_', ' ').toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      <View style={styles.btnRow}>
        <Button
          title="Cancel"
          variant="secondary"
          onPress={onClose}
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button
          title={initialData ? 'Save Changes' : 'Create Task'}
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
    marginHorizontal: 3,
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
