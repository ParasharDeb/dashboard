import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { IBirthday } from '../../types';

interface BirthdayFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<IBirthday>) => Promise<void>;
  initialData?: IBirthday | null;
}

export const BirthdayFormModal: React.FC<BirthdayFormModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [relationship, setRelationship] = useState('Friend');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDateOfBirth(
        initialData.dateOfBirth
          ? new Date(initialData.dateOfBirth).toISOString().split('T')[0]
          : ''
      );
      setRelationship(initialData.relationship || 'Friend');
      setNotes(initialData.notes || '');
    } else {
      setName('');
      setDateOfBirth('');
      setRelationship('Friend');
      setNotes('');
    }
    setError('');
  }, [initialData, visible]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Person name is required');
      return;
    }
    if (!dateOfBirth.trim()) {
      setError('Date of birth is required');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        dateOfBirth: new Date(dateOfBirth).toISOString(),
        relationship: relationship.trim() || 'Friend',
        notes: notes.trim(),
      });
      onClose();
    } catch (e: any) {
      setError(e.message || 'Failed to save birthday');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={initialData ? 'Edit Birthday Details' : 'Add Birthday Entry'}
    >
      <Input
        label="Full Name *"
        placeholder="e.g. Sarah Jenkins"
        value={name}
        onChangeText={setName}
        error={error}
      />
      <Input
        label="Date of Birth (YYYY-MM-DD) *"
        placeholder="1995-08-15"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
      />
      <Input
        label="Relationship"
        placeholder="Friend, Colleague, Family, Sister..."
        value={relationship}
        onChangeText={setRelationship}
      />
      <Input
        label="Gift Ideas / Notes"
        placeholder="Loves fiction books & coffee mugs..."
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={2}
      />

      <View style={styles.btnRow}>
        <Button
          title="Cancel"
          variant="secondary"
          onPress={onClose}
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button
          title={initialData ? 'Save Changes' : 'Add Birthday'}
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
  btnRow: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 12,
  },
});
