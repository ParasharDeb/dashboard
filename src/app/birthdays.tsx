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
import { useBirthdayStore } from '../store/useBirthdayStore';
import { Colors } from '../constants/theme';
import { BirthdayItem } from '../components/birthdays/BirthdayItem';
import { BirthdayFormModal } from '../components/birthdays/BirthdayFormModal';
import { IBirthday } from '../types';
import { Button } from '../components/ui/Button';

export default function BirthdaysScreen() {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colors = Colors[scheme];

  const { birthdays, loading, error, fetchBirthdays, addBirthday, updateBirthday, deleteBirthday } =
    useBirthdayStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBirthday, setSelectedBirthday] = useState<IBirthday | null>(null);

  useEffect(() => {
    fetchBirthdays();
  }, []);

  const handleOpenCreate = () => {
    setSelectedBirthday(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (bday: IBirthday) => {
    setSelectedBirthday(bday);
    setModalVisible(true);
  };

  const handleFormSubmit = async (data: Partial<IBirthday>) => {
    if (selectedBirthday) {
      await updateBirthday(selectedBirthday._id, data);
    } else {
      await addBirthday(data);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Birthday Tracker</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Upcoming birthdays, ages & zodiac signs ({birthdays.length})
          </Text>
        </View>

        <TouchableOpacity onPress={handleOpenCreate} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
          <SymbolView name="plus" size={18} tintColor="#FFFFFF" />
          <Text style={styles.addBtnText}>Add Birthday</Text>
        </TouchableOpacity>
      </View>

      {/* Birthday List */}
      <FlatList
        data={birthdays}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <BirthdayItem
            birthday={item}
            onEdit={handleOpenEdit}
            onDelete={deleteBirthday}
          />
        )}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchBirthdays} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyBox}>
              <SymbolView name="gift" size={48} tintColor={colors.textMuted} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No birthdays recorded yet.
              </Text>
              <Button
                title="Add First Birthday"
                variant="secondary"
                size="sm"
                onPress={handleOpenCreate}
                style={{ marginTop: 12 }}
              />
            </View>
          ) : null
        }
      />

      <BirthdayFormModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedBirthday}
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
    marginBottom: 16,
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
