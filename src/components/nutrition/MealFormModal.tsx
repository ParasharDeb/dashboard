import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { INutritionLog, MealType } from '../../types';
import { Colors } from '../../constants/theme';

interface MealFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<INutritionLog>) => Promise<void>;
  initialData?: INutritionLog | null;
}

export const MealFormModal: React.FC<MealFormModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
}) => {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colors = Colors[scheme];

  const [foodName, setFoodName] = useState('');
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFoodName(initialData.foodName);
      setMealType(initialData.mealType);
      setCalories(String(initialData.calories || 0));
      setProtein(String(initialData.protein || 0));
      setCarbs(String(initialData.carbs || 0));
      setFat(String(initialData.fat || 0));
    } else {
      setFoodName('');
      setMealType('lunch');
      setCalories('');
      setProtein('');
      setCarbs('');
      setFat('');
    }
    setError('');
  }, [initialData, visible]);

  const handleSubmit = async () => {
    if (!foodName.trim()) {
      setError('Food item name is required');
      return;
    }
    if (!calories || Number(calories) < 0) {
      setError('Valid calories amount is required');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        foodName: foodName.trim(),
        mealType,
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
      });
      onClose();
    } catch (e: any) {
      setError(e.message || 'Failed to save meal log');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={initialData ? 'Edit Meal Log' : 'Log Food / Meal Item'}
    >
      <Input
        label="Food Item Name *"
        placeholder="e.g. Grilled Chicken & Quinoa"
        value={foodName}
        onChangeText={setFoodName}
        error={error}
      />

      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Meal Category</Text>
      <View style={styles.segmentedRow}>
        {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((m) => (
          <TouchableOpacity
            key={m}
            onPress={() => setMealType(m)}
            style={[
              styles.segment,
              { backgroundColor: colors.cardHover, borderColor: colors.border },
              mealType === m && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
          >
            <Text
              style={[
                styles.segmentText,
                { color: mealType === m ? '#FFFFFF' : colors.textSecondary },
              ]}
            >
              {m.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.inlineRow}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Input
            label="Calories (kcal) *"
            placeholder="550"
            keyboardType="numeric"
            value={calories}
            onChangeText={setCalories}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Input
            label="Protein (grams) *"
            placeholder="45"
            keyboardType="numeric"
            value={protein}
            onChangeText={setProtein}
          />
        </View>
      </View>

      <View style={styles.inlineRow}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Input
            label="Carbs (g)"
            placeholder="50"
            keyboardType="numeric"
            value={carbs}
            onChangeText={setCarbs}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Input
            label="Fat (g)"
            placeholder="15"
            keyboardType="numeric"
            value={fat}
            onChangeText={setFat}
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
          title={initialData ? 'Save Changes' : 'Log Food Item'}
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
    fontSize: 10,
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
