import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { INutritionGoal } from '../../types';

interface NutritionGoalsModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<INutritionGoal>) => Promise<void>;
  initialGoals: INutritionGoal;
}

export const NutritionGoalsModal: React.FC<NutritionGoalsModalProps> = ({
  visible,
  onClose,
  onSubmit,
  initialGoals,
}) => {
  const [dailyCalories, setDailyCalories] = useState('2200');
  const [dailyProtein, setDailyProtein] = useState('150');
  const [dailyCarbs, setDailyCarbs] = useState('250');
  const [dailyFat, setDailyFat] = useState('70');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialGoals) {
      setDailyCalories(String(initialGoals.dailyCalories || 2200));
      setDailyProtein(String(initialGoals.dailyProtein || 150));
      setDailyCarbs(String(initialGoals.dailyCarbs || 250));
      setDailyFat(String(initialGoals.dailyFat || 70));
    }
  }, [initialGoals, visible]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onSubmit({
        dailyCalories: Number(dailyCalories) || 2200,
        dailyProtein: Number(dailyProtein) || 150,
        dailyCarbs: Number(dailyCarbs) || 250,
        dailyFat: Number(dailyFat) || 70,
      });
      onClose();
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Set Daily Nutrition Goals">
      <Input
        label="Target Daily Calories (kcal)"
        placeholder="2200"
        keyboardType="numeric"
        value={dailyCalories}
        onChangeText={setDailyCalories}
      />
      <Input
        label="Target Daily Protein (grams)"
        placeholder="150"
        keyboardType="numeric"
        value={dailyProtein}
        onChangeText={setDailyProtein}
      />
      <Input
        label="Target Daily Carbs (grams)"
        placeholder="250"
        keyboardType="numeric"
        value={dailyCarbs}
        onChangeText={setDailyCarbs}
      />
      <Input
        label="Target Daily Fat (grams)"
        placeholder="70"
        keyboardType="numeric"
        value={dailyFat}
        onChangeText={setDailyFat}
      />

      <View style={styles.btnRow}>
        <Button
          title="Cancel"
          variant="secondary"
          onPress={onClose}
          style={{ flex: 1, marginRight: 8 }}
        />
        <Button
          title="Update Goals"
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
