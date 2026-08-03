import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, ViewStyle } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { IBirthday } from '../../types';
import { Colors } from '../../constants/theme';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface BirthdayItemProps {
  birthday: IBirthday;
  onEdit: (bday: IBirthday) => void;
  onDelete: (id: string) => void;
}

export const BirthdayItem: React.FC<BirthdayItemProps> = ({ birthday, onEdit, onDelete }) => {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colors = Colors[scheme];

  const daysLeft = birthday.daysRemaining !== undefined ? birthday.daysRemaining : 999;
  const isToday = birthday.isToday || daysLeft === 0;
  const isThisWeek = birthday.isThisWeek || (daysLeft > 0 && daysLeft <= 7);

  const getDaysBadge = () => {
    if (isToday) {
      return (
        <Badge
          label="🎉 TODAY!"
          size="md"
          color="#FFFFFF"
          backgroundColor={colors.danger}
          borderColor={colors.danger}
        />
      );
    }
    if (isThisWeek) {
      return (
        <Badge
          label={`🎂 In ${daysLeft} days`}
          size="sm"
          color={colors.warning}
          backgroundColor={`${colors.warning}20`}
          borderColor={`${colors.warning}40`}
        />
      );
    }
    return (
      <Badge
        label={`In ${daysLeft} days`}
        size="sm"
        color={colors.textSecondary}
        backgroundColor={colors.cardHover}
        borderColor={colors.border}
      />
    );
  };

  const formattedDob = birthday.dateOfBirth
    ? new Date(birthday.dateOfBirth).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      })
    : '';

  const cardStyle: ViewStyle = isToday ? { borderColor: colors.danger, borderWidth: 2 } : {};

  return (
    <Card style={{ ...styles.card, ...cardStyle }}>
      <View style={styles.row}>
        <View style={[styles.avatarBox, { backgroundColor: colors.purple }]}>
          <Text style={styles.avatarText}>{birthday.name.charAt(0).toUpperCase()}</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={[styles.name, { color: colors.text }]}>{birthday.name}</Text>
            {getDaysBadge()}
          </View>

          <View style={styles.detailsRow}>
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {birthday.relationship} • {formattedDob}
              {birthday.turningAge ? ` (Turning ${birthday.turningAge})` : ''}
            </Text>
            {birthday.zodiac ? (
              <Badge
                label={`✨ ${birthday.zodiac}`}
                size="sm"
                color={colors.purple}
                backgroundColor={`${colors.purple}15`}
                borderColor={`${colors.purple}30`}
                style={{ marginLeft: 6 }}
              />
            ) : null}
          </View>
          {birthday.notes ? (
            <Text style={[styles.notes, { color: colors.textMuted }]} numberOfLines={1}>
              💡 {birthday.notes}
            </Text>
          ) : null}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => onEdit(birthday)} style={styles.actionBtn}>
            <SymbolView name="pencil" size={16} tintColor={colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onDelete(birthday._id)} style={styles.actionBtn}>
            <SymbolView name="trash" size={16} tintColor={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 4,
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
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
  name: {
    fontSize: 15,
    fontWeight: '700',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  detailText: {
    fontSize: 12,
  },
  notes: {
    fontSize: 12,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  actionBtn: {
    padding: 6,
    marginLeft: 2,
  },
});
