import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { SymbolView } from 'expo-symbols';
import { Pressable, useColorScheme, View, StyleSheet } from 'react-native';

import { Colors } from '@/constants/theme';
import { useDashboardStore } from '@/store/useDashboardStore';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ flex: 1 }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="dashboard" href="/" asChild>
            <TabButton>Dashboard</TabButton>
          </TabTrigger>
          <TabTrigger name="todos" href="/todos" asChild>
            <TabButton>Todos</TabButton>
          </TabTrigger>
          <TabTrigger name="routines" href="/routines" asChild>
            <TabButton>Routines</TabButton>
          </TabTrigger>
          <TabTrigger name="health" href="/health" asChild>
            <TabButton>Health & Weight</TabButton>
          </TabTrigger>
          <TabTrigger name="birthdays" href="/birthdays" asChild>
            <TabButton>Birthdays</TabButton>
          </TabTrigger>
          <TabTrigger name="import" href="/import" asChild>
            <TabButton>Spreadsheet Import</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colors = Colors[scheme];

  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <View
        style={[
          styles.tabButtonView,
          { backgroundColor: isFocused ? colors.primary : colors.cardHover },
        ]}
      >
        <SymbolView
          name={
            children === 'Dashboard'
              ? 'house.fill'
              : children === 'Todos'
              ? 'checkmark.circle.fill'
              : children === 'Routines'
              ? 'repeat.circle.fill'
              : children?.toString().includes('Health')
              ? 'heart.fill'
              : children === 'Birthdays'
              ? 'gift.fill'
              : 'square.and.arrow.down.fill'
          }
          size={14}
          tintColor={isFocused ? '#FFFFFF' : colors.textSecondary}
        />
        <View style={{ width: 6 }} />
        <View>
          <View style={{ flex: 1 }}>
            <View>
              <View style={{ flex: 1 }}>
                <View>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={{ flex: 1 }}>
                        <View style={{ paddingHorizontal: 2 }}>
                          {/* Label */}
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const scheme = useColorScheme() === 'light' ? 'light' : 'dark';
  const colors = Colors[scheme];

  return (
    <View
      {...props}
      style={[
        styles.tabListContainer,
        { backgroundColor: colors.card, borderTopColor: colors.border },
      ]}
    >
      <View style={styles.innerContainer}>{props.children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    width: '100%',
    paddingVertical: 8,
    borderTopWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    maxWidth: 900,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
