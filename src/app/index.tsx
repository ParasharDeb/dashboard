import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useDashboardStore } from '../store/useDashboardStore';
import { Colors } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';

export default function DashboardScreen() {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colors = Colors[scheme];
  const router = useRouter();

  const { summary, loading, error, fetchSummary, seedData } = useDashboardStore();

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleSeed = async () => {
    await seedData();
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchSummary} tintColor={colors.primary} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome back 👋</Text>
          <Text style={[styles.title, { color: colors.text }]}>Dashboard Overview</Text>
        </View>

        <TouchableOpacity
          onPress={handleSeed}
          style={[styles.seedBtn, { backgroundColor: colors.cardHover, borderColor: colors.border }]}
        >
          <SymbolView name="sparkles" size={16} tintColor={colors.warning} />
          <Text style={[styles.seedText, { color: colors.text }]}>Seed Data</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <Card style={[styles.errorCard, { borderColor: colors.danger }] as any}>
          <Text style={[styles.errorText, { color: colors.danger }]}>⚠️ {error}</Text>
          <Button
            title="Retry Connecting"
            size="sm"
            variant="danger"
            onPress={fetchSummary}
            style={{ marginTop: 8 }}
          />
        </Card>
      ) : null}

      {/* Summary Stat Cards */}
      <View style={styles.statsRow}>
        <StatCard
          title="Pending Todos"
          value={summary ? summary.todos.pending : 0}
          subtitle={`${summary?.todos.completed || 0} completed`}
          accentColor={colors.primary}
          icon={<SymbolView name="checkmark.circle.fill" size={18} tintColor={colors.primary} />}
        />
        <StatCard
          title="Habit Completion"
          value={`${summary ? summary.routines.completionRate : 0}%`}
          subtitle={`${summary?.routines.completedToday || 0}/${summary?.routines.total || 0} done`}
          accentColor={colors.success}
          icon={<SymbolView name="repeat.circle.fill" size={18} tintColor={colors.success} />}
        />
      </View>

      <View style={styles.statsRow}>
        <StatCard
          title="Latest Weight"
          value={summary?.weight.latest ? `${summary.weight.latest} ${summary.weight.unit}` : 'N/A'}
          subtitle={
            summary?.weight.change !== undefined
              ? `${summary.weight.change >= 0 ? '+' : ''}${summary.weight.change} ${summary.weight.unit} trend`
              : 'Log weight'
          }
          accentColor={colors.purple}
          icon={<SymbolView name="scalemass.fill" size={18} tintColor={colors.purple} />}
        />
        <StatCard
          title="Calories Logged"
          value={summary?.nutrition.caloriesToday ? `${summary.nutrition.caloriesToday}` : 0}
          subtitle={`Goal: ${summary?.nutrition.calorieGoal || 2200} kcal`}
          accentColor={colors.warning}
          icon={<SymbolView name="flame.fill" size={18} tintColor={colors.warning} />}
        />
      </View>

      {/* Today's Nutrition Progress */}
      {summary?.nutrition ? (
        <Card style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Nutrition Goals</Text>
            <TouchableOpacity onPress={() => router.push('/health')}>
              <Text style={[styles.linkText, { color: colors.primary }]}>View Details →</Text>
            </TouchableOpacity>
          </View>

          <ProgressBar
            label="Calories"
            current={summary.nutrition.caloriesToday}
            target={summary.nutrition.calorieGoal}
            unit="kcal"
            color={colors.warning}
          />

          <ProgressBar
            label="Protein"
            current={summary.nutrition.proteinToday}
            target={summary.nutrition.proteinGoal}
            unit="g"
            color={colors.primary}
          />
        </Card>
      ) : null}

      {/* Quick Action Buttons */}
      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 12, marginBottom: 8 }]}>
        Quick Actions
      </Text>
      <View style={styles.actionGrid}>
        <TouchableOpacity
          onPress={() => router.push('/todos')}
          style={[styles.actionCard, { backgroundColor: colors.cardHover, borderColor: colors.border }]}
        >
          <SymbolView name="plus.circle.fill" size={24} tintColor={colors.primary} />
          <Text style={[styles.actionTitle, { color: colors.text }]}>Add Todo Task</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/routines')}
          style={[styles.actionCard, { backgroundColor: colors.cardHover, borderColor: colors.border }]}
        >
          <SymbolView name="checkmark.seal.fill" size={24} tintColor={colors.success} />
          <Text style={[styles.actionTitle, { color: colors.text }]}>Log Routines</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/health')}
          style={[styles.actionCard, { backgroundColor: colors.cardHover, borderColor: colors.border }]}
        >
          <SymbolView name="flame.fill" size={24} tintColor={colors.warning} />
          <Text style={[styles.actionTitle, { color: colors.text }]}>Log Meal / Weight</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push('/import')}
          style={[styles.actionCard, { backgroundColor: colors.cardHover, borderColor: colors.border }]}
        >
          <SymbolView name="square.and.arrow.down.fill" size={24} tintColor={colors.purple} />
          <Text style={[styles.actionTitle, { color: colors.text }]}>Import XLSX</Text>
        </TouchableOpacity>
      </View>

      {/* Upcoming Birthdays Section */}
      {summary?.upcomingBirthdays && summary.upcomingBirthdays.length > 0 ? (
        <Card style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>🎉 Upcoming Birthdays</Text>
            <TouchableOpacity onPress={() => router.push('/birthdays')}>
              <Text style={[styles.linkText, { color: colors.primary }]}>View All →</Text>
            </TouchableOpacity>
          </View>

          {summary.upcomingBirthdays.map((bday) => (
            <View key={bday._id} style={[styles.bdayRow, { borderBottomColor: colors.border }]}>
              <View style={[styles.avatar, { backgroundColor: colors.purple }]}>
                <Text style={styles.avatarText}>{bday.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.bdayName, { color: colors.text }]}>{bday.name}</Text>
                <Text style={[styles.bdayMeta, { color: colors.textSecondary }]}>
                  {bday.relationship} • Turning {bday.turningAge}
                </Text>
              </View>
              <Text
                style={[
                  styles.bdayDays,
                  { color: bday.isToday ? colors.danger : colors.warning },
                ]}
              >
                {bday.isToday ? 'TODAY!' : `In ${bday.daysRemaining} days`}
              </Text>
            </View>
          ))}
        </Card>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 8,
  },
  greeting: {
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  seedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  seedText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  errorCard: {
    padding: 12,
    marginVertical: 8,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
    marginBottom: 4,
  },
  sectionCard: {
    marginVertical: 10,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  linkText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
    marginBottom: 12,
  },
  actionCard: {
    width: '48%',
    margin: '1%',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
  },
  bdayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  bdayName: {
    fontSize: 14,
    fontWeight: '700',
  },
  bdayMeta: {
    fontSize: 12,
  },
  bdayDays: {
    fontSize: 12,
    fontWeight: '700',
  },
});
