import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, FlatList, ViewStyle } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { IParsedRecord } from '../../types';
import { Colors } from '../../constants/theme';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface ParsedTablePreviewProps {
  records: IParsedRecord<any>[];
  selectedIds: Set<string>;
  onToggleRecord: (id: string) => void;
  entityName: string;
}

export const ParsedTablePreview: React.FC<ParsedTablePreviewProps> = ({
  records,
  selectedIds,
  onToggleRecord,
  entityName,
}) => {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colors = Colors[scheme];

  if (!records || records.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          No {entityName} detected in uploaded spreadsheet.
        </Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: IParsedRecord<any> }) => {
    const isSelected = selectedIds.has(item.id);
    const data = item.data;
    const cardStyle: ViewStyle = !item.isValid ? { borderColor: colors.warning } : {};

    return (
      <Card style={{ ...styles.card, ...cardStyle }}>
        <View style={styles.row}>
          <TouchableOpacity
            onPress={() => onToggleRecord(item.id)}
            style={[
              styles.checkbox,
              { borderColor: isSelected ? colors.primary : colors.border },
              isSelected ? { backgroundColor: colors.primary } : null,
            ]}
          >
            {isSelected && <SymbolView name="checkmark" size={14} tintColor="#FFFFFF" />}
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.headerRow}>
              <Text style={[styles.title, { color: colors.text }]}>
                {data.title || data.foodName || data.name || `Weight ${data.weight} ${data.unit || 'kg'}`}
              </Text>
              {item.isValid ? (
                <Badge label="Valid" size="sm" color={colors.success} backgroundColor={`${colors.success}15`} borderColor={`${colors.success}30`} />
              ) : (
                <Badge label="Warning" size="sm" color={colors.warning} backgroundColor={`${colors.warning}15`} borderColor={`${colors.warning}30`} />
              )}
            </View>

            <Text style={[styles.details, { color: colors.textSecondary }]}>
              {data.category ? `Category: ${data.category} • ` : ''}
              {data.priority ? `Priority: ${data.priority} • ` : ''}
              {data.calories ? `Calories: ${data.calories} kcal • ` : ''}
              {data.protein ? `Protein: ${data.protein}g • ` : ''}
              {data.date ? `Date: ${data.date} • ` : ''}
              {data.dateOfBirth ? `DOB: ${new Date(data.dateOfBirth).toISOString().split('T')[0]}` : ''}
            </Text>

            {item.errors && item.errors.length > 0 ? (
              <Text style={[styles.errorText, { color: colors.warning }]}>
                ⚠️ {item.errors.join(', ')}
              </Text>
            ) : null}
          </View>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  card: {
    marginVertical: 4,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  details: {
    fontSize: 12,
  },
  errorText: {
    fontSize: 11,
    marginTop: 4,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
  },
});
