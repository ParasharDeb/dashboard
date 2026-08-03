import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { SymbolView } from 'expo-symbols';
import { useImportStore } from '../store/useImportStore';
import { Colors } from '../constants/theme';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ParsedTablePreview } from '../components/importer/ParsedTablePreview';

export default function ImportScreen() {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colors = Colors[scheme];

  const [activeCategory, setActiveCategory] = useState<'todos' | 'routines' | 'nutrition' | 'weight' | 'birthdays'>('todos');

  const {
    preview,
    selectedIds,
    parsing,
    committing,
    error,
    successSummary,
    toggleSelection,
    selectAll,
    deselectAll,
    parseSpreadsheet,
    commitSelected,
    resetImport,
  } = useImportStore();

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
          'text/csv',
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        await parseSpreadsheet(file.uri, file.name, file.mimeType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      }
    } catch (e: any) {
      Alert.alert('File Picker Error', e.message || 'Could not pick file');
    }
  };

  const handleCommit = async () => {
    if (selectedIds.size === 0) {
      Alert.alert('No Items Selected', 'Please select at least one record to import.');
      return;
    }
    await commitSelected();
  };

  const getCategoryCount = (cat: 'todos' | 'routines' | 'nutrition' | 'weight' | 'birthdays') => {
    if (!preview || !preview[cat]) return 0;
    return preview[cat].length;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Spreadsheet Importer</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Upload .xlsx, .xls or .csv to parse and import data into MongoDB
          </Text>
        </View>
      </View>

      {/* Success Summary View */}
      {successSummary ? (
        <Card style={[styles.successCard, { borderColor: colors.success }] as any}>
          <SymbolView name="checkmark.circle.fill" size={36} tintColor={colors.success} />
          <Text style={[styles.successTitle, { color: colors.text }]}>Import Completed Successfully! 🎉</Text>
          <Text style={[styles.successMeta, { color: colors.textSecondary }]}>
            • Todos: {successSummary.todosImported || 0}{'\n'}
            • Daily Routines: {successSummary.routinesImported || 0}{'\n'}
            • Nutrition Logs: {successSummary.nutritionImported || 0}{'\n'}
            • Weight Logs: {successSummary.weightImported || 0}{'\n'}
            • Birthdays: {successSummary.birthdaysImported || 0}
          </Text>
          <Button
            title="Import Another File"
            variant="primary"
            onPress={resetImport}
            style={{ marginTop: 14 }}
          />
        </Card>
      ) : null}

      {/* Upload Drop Zone / Picker */}
      {!preview && !successSummary ? (
        <Card style={styles.uploadCard}>
          <SymbolView name="square.and.arrow.down.fill" size={48} tintColor={colors.primary} />
          <Text style={[styles.uploadTitle, { color: colors.text }]}>Select Excel / CSV File</Text>
          <Text style={[styles.uploadSubtitle, { color: colors.textMuted }]}>
            Upload multi-sheet or single-sheet spreadsheets containing Todos, Routines, Meals, Weight logs, or Birthdays.
          </Text>

          <Button
            title={parsing ? 'Parsing Spreadsheet...' : 'Choose File (.xlsx)'}
            variant="primary"
            loading={parsing}
            onPress={handlePickDocument}
            style={{ marginTop: 16, paddingHorizontal: 32 }}
          />

          {error ? <Text style={[styles.errorText, { color: colors.danger }]}>⚠️ {error}</Text> : null}
        </Card>
      ) : null}

      {/* PREVIEW & PRE-COMMIT STAGE */}
      {preview ? (
        <View style={{ width: '100%' }}>
          <View style={styles.previewHeader}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Import Preview & Selection
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {selectedIds.size} records selected for database commit
              </Text>
            </View>

            <TouchableOpacity onPress={resetImport} style={styles.resetBtn}>
              <Text style={[styles.resetText, { color: colors.danger }]}>Clear File</Text>
            </TouchableOpacity>
          </View>

          {/* Category Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
            {(['todos', 'routines', 'nutrition', 'weight', 'birthdays'] as const).map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[
                  styles.tabChip,
                  { backgroundColor: colors.cardHover, borderColor: colors.border },
                  activeCategory === cat && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.tabChipText,
                    { color: activeCategory === cat ? '#FFFFFF' : colors.textSecondary },
                  ]}
                >
                  {cat.toUpperCase()} ({getCategoryCount(cat)})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Select All / Deselect All Bar */}
          <View style={styles.controlRow}>
            <TouchableOpacity onPress={selectAll} style={styles.controlBtn}>
              <Text style={[styles.controlText, { color: colors.primary }]}>Select All</Text>
            </TouchableOpacity>
            <Text style={{ color: colors.textMuted }}>|</Text>
            <TouchableOpacity onPress={deselectAll} style={styles.controlBtn}>
              <Text style={[styles.controlText, { color: colors.textSecondary }]}>Deselect All</Text>
            </TouchableOpacity>
          </View>

          {/* Parsed Category Table */}
          <ParsedTablePreview
            records={preview[activeCategory] || []}
            selectedIds={selectedIds}
            onToggleRecord={toggleSelection}
            entityName={activeCategory}
          />

          {/* Commit Button */}
          <Button
            title={`Commit ${selectedIds.size} Selected Items to Database`}
            variant="success"
            loading={committing}
            disabled={selectedIds.size === 0}
            onPress={handleCommit}
            style={{ marginTop: 20, paddingVertical: 16 }}
          />
        </View>
      ) : null}
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
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
  },
  uploadCard: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    borderStyle: 'dashed',
    borderWidth: 2,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  uploadSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  errorText: {
    fontSize: 13,
    marginTop: 12,
    fontWeight: '600',
  },
  successCard: {
    padding: 24,
    alignItems: 'center',
    marginVertical: 12,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
  },
  successMeta: {
    fontSize: 14,
    marginTop: 8,
    lineHeight: 22,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  resetBtn: {
    padding: 6,
  },
  resetText: {
    fontSize: 13,
    fontWeight: '600',
  },
  tabScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tabChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 18,
    borderWidth: 1,
    marginRight: 8,
  },
  tabChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: 6,
    gap: 8,
  },
  controlBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  controlText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
