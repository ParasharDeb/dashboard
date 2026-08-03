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
import { useNutritionStore } from '../store/useNutritionStore';
import { useWeightStore } from '../store/useWeightStore';
import { Colors } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatCard } from '../components/ui/StatCard';
import { MealLogItem } from '../components/nutrition/MealLogItem';
import { MealFormModal } from '../components/nutrition/MealFormModal';
import { NutritionGoalsModal } from '../components/nutrition/NutritionGoalsModal';
import { WeightChart } from '../components/weight/WeightChart';
import { WeightFormModal } from '../components/weight/WeightFormModal';
import { INutritionLog, IWeightLog } from '../types';

export default function HealthScreen() {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colors = Colors[scheme];

  const [activeTab, setActiveTab] = useState<'nutrition' | 'weight'>('nutrition');

  // Stores
  const {
    logs: mealLogs,
    totals,
    goals,
    loading: nutritionLoading,
    fetchNutrition,
    addLog: addMealLog,
    updateLog: updateMealLog,
    deleteLog: deleteMealLog,
    updateGoals,
  } = useNutritionStore();

  const {
    logs: weightLogs,
    stats: weightStats,
    rangeDays,
    loading: weightLoading,
    setRangeDays,
    fetchWeightLogs,
    logWeight,
    updateWeightLog,
    deleteWeightLog,
  } = useWeightStore();

  // Modals
  const [mealModalVisible, setMealModalVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<INutritionLog | null>(null);

  const [goalsModalVisible, setGoalsModalVisible] = useState(false);

  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState<IWeightLog | null>(null);

  useEffect(() => {
    fetchNutrition();
    fetchWeightLogs();
  }, []);

  // Handlers
  const handleOpenMealCreate = () => {
    setSelectedMeal(null);
    setMealModalVisible(true);
  };

  const handleOpenMealEdit = (log: INutritionLog) => {
    setSelectedMeal(log);
    setMealModalVisible(true);
  };

  const handleMealFormSubmit = async (data: Partial<INutritionLog>) => {
    if (selectedMeal) {
      await updateMealLog(selectedMeal._id, data);
    } else {
      await addMealLog(data);
    }
  };

  const handleOpenWeightCreate = () => {
    setSelectedWeight(null);
    setWeightModalVisible(true);
  };

  const handleOpenWeightEdit = (log: IWeightLog) => {
    setSelectedWeight(log);
    setWeightModalVisible(true);
  };

  const handleWeightFormSubmit = async (data: Partial<IWeightLog>) => {
    if (selectedWeight) {
      await updateWeightLog(selectedWeight._id, data);
    } else {
      await logWeight(data);
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={nutritionLoading || weightLoading}
          onRefresh={() => {
            fetchNutrition();
            fetchWeightLogs();
          }}
          tintColor={colors.primary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Health & Body</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Nutrition Tracker & Weight Trend Analytics
          </Text>
        </View>
      </View>

      {/* Tab Selector */}
      <View style={[styles.tabSelector, { backgroundColor: colors.cardHover, borderColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => setActiveTab('nutrition')}
          style={[styles.tabBtn, activeTab === 'nutrition' && { backgroundColor: colors.primary }]}
        >
          <SymbolView
            name="flame.fill"
            size={16}
            tintColor={activeTab === 'nutrition' ? '#FFFFFF' : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabBtnText,
              { color: activeTab === 'nutrition' ? '#FFFFFF' : colors.textSecondary },
            ]}
          >
            Nutrition & Goals
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('weight')}
          style={[styles.tabBtn, activeTab === 'weight' && { backgroundColor: colors.primary }]}
        >
          <SymbolView
            name="scalemass.fill"
            size={16}
            tintColor={activeTab === 'weight' ? '#FFFFFF' : colors.textSecondary}
          />
          <Text
            style={[
              styles.tabBtnText,
              { color: activeTab === 'weight' ? '#FFFFFF' : colors.textSecondary },
            ]}
          >
            Body Weight
          </Text>
        </TouchableOpacity>
      </View>

      {/* NUTRITION TAB CONTENT */}
      {activeTab === 'nutrition' ? (
        <View style={{ width: '100%' }}>
          {/* Nutrition Summary Progress Card */}
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Daily Macro Progress</Text>
              <TouchableOpacity onPress={() => setGoalsModalVisible(true)}>
                <Text style={[styles.linkText, { color: colors.primary }]}>Set Goals ⚙️</Text>
              </TouchableOpacity>
            </View>

            <ProgressBar
              label="Calories Target"
              current={totals.calories}
              target={goals.dailyCalories || 2200}
              unit="kcal"
              color={colors.warning}
            />

            <ProgressBar
              label="Protein Goal"
              current={totals.protein}
              target={goals.dailyProtein || 150}
              unit="g"
              color={colors.primary}
            />

            <ProgressBar
              label="Carbohydrates Goal"
              current={totals.carbs}
              target={goals.dailyCarbs || 250}
              unit="g"
              color={colors.purple}
            />

            <ProgressBar
              label="Fat Goal"
              current={totals.fat}
              target={goals.dailyFat || 70}
              unit="g"
              color={colors.cyan}
            />
          </Card>

          {/* Meal Log List */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Logged Meals Today</Text>
            <Button
              title="+ Log Meal"
              size="sm"
              variant="primary"
              onPress={handleOpenMealCreate}
            />
          </View>

          {mealLogs.map((log) => (
            <MealLogItem
              key={log._id}
              log={log}
              onEdit={handleOpenMealEdit}
              onDelete={deleteMealLog}
            />
          ))}

          {mealLogs.length === 0 ? (
            <View style={styles.emptyBox}>
              <SymbolView name="fork.knife" size={44} tintColor={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No meals logged today yet.
              </Text>
            </View>
          ) : null}
        </View>
      ) : (
        /* BODY WEIGHT TAB CONTENT */
        <View style={{ width: '100%' }}>
          {/* Weight Stat Cards */}
          <View style={styles.statsRow}>
            <StatCard
              title="Current Weight"
              value={weightStats.latest ? `${weightStats.latest} kg` : 'N/A'}
              subtitle="Latest Entry"
              accentColor={colors.purple}
            />
            <StatCard
              title="Weight Trend"
              value={`${weightStats.change >= 0 ? '+' : ''}${weightStats.change} kg`}
              subtitle={`Over ${rangeDays} days`}
              accentColor={weightStats.change <= 0 ? colors.success : colors.warning}
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              title="Min / Max"
              value={`${weightStats.min || 0} / ${weightStats.max || 0}`}
              subtitle="Range span"
              accentColor={colors.cyan}
            />
            <StatCard
              title="Average Weight"
              value={weightStats.avg ? `${weightStats.avg} kg` : 'N/A'}
              subtitle="Period Average"
              accentColor={colors.primary}
            />
          </View>

          {/* Interactive Weight Chart */}
          <View style={styles.rangeSelector}>
            {[7, 30, 90].map((days) => (
              <TouchableOpacity
                key={days}
                onPress={() => setRangeDays(days)}
                style={[
                  styles.rangeChip,
                  { backgroundColor: colors.cardHover, borderColor: colors.border },
                  rangeDays === days && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.rangeChipText,
                    { color: rangeDays === days ? '#FFFFFF' : colors.textSecondary },
                  ]}
                >
                  {days} Days
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <WeightChart logs={weightLogs} unit="kg" />

          {/* Log History */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Weight Entry History</Text>
            <Button
              title="+ Log Weight"
              size="sm"
              variant="primary"
              onPress={handleOpenWeightCreate}
            />
          </View>

          {weightLogs.map((item) => (
            <Card key={item._id} style={styles.weightItemCard}>
              <View style={styles.weightItemRow}>
                <View>
                  <Text style={[styles.weightValue, { color: colors.text }]}>
                    {item.weight} {item.unit || 'kg'}
                  </Text>
                  <Text style={[styles.weightDate, { color: colors.textSecondary }]}>
                    📅 {item.date} {item.notes ? `• ${item.notes}` : ''}
                  </Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => handleOpenWeightEdit(item)} style={styles.actionBtn}>
                    <SymbolView name="pencil" size={16} tintColor={colors.textSecondary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteWeightLog(item._id)} style={styles.actionBtn}>
                    <SymbolView name="trash" size={16} tintColor={colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* Modals */}
      <MealFormModal
        visible={mealModalVisible}
        onClose={() => setMealModalVisible(false)}
        onSubmit={handleMealFormSubmit}
        initialData={selectedMeal}
      />

      <NutritionGoalsModal
        visible={goalsModalVisible}
        onClose={() => setGoalsModalVisible(false)}
        onSubmit={updateGoals}
        initialGoals={goals}
      />

      <WeightFormModal
        visible={weightModalVisible}
        onClose={() => setWeightModalVisible(false)}
        onSubmit={handleWeightFormSubmit}
        initialData={selectedWeight}
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
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
  },
  tabSelector: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginBottom: 4,
  },
  rangeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  rangeChip: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  rangeChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  weightItemCard: {
    marginVertical: 4,
    padding: 14,
  },
  weightItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weightValue: {
    fontSize: 17,
    fontWeight: '700',
  },
  weightDate: {
    fontSize: 12,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    padding: 6,
    marginLeft: 4,
  },
});
