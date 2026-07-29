import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MoodOrb } from '@/components/echo/mood-orb';
import { MetricPill } from '@/components/echo/metric-pill';

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 96 }}
          showsVerticalScrollIndicator={false}>
          <View className="flex-row items-center justify-between pb-4 pt-2">
            <Text className="text-2xl font-bold tracking-tight text-foreground">Echo</Text>
            <View className="flex-row items-center gap-2">
              <View className="rounded-pill border border-streak/30 bg-streak/15 px-3 py-2">
                <Text className="text-xs font-semibold text-streak">🔥 6</Text>
              </View>
              <View className="h-10 w-10 items-center justify-center rounded-pill border border-white/10 bg-white/10">
                <Text className="font-semibold text-foreground">V</Text>
              </View>
            </View>
          </View>

          <View className="items-center pb-2 pt-8">
            <MoodOrb />
            <Text className="mt-8 text-[11px] font-semibold uppercase tracking-[3px] text-white/45">
              Day score
            </Text>
            <View className="mt-1 flex-row items-center gap-2">
              <Text className="text-7xl font-light tracking-[-4px] text-foreground">74</Text>
              <Text className="text-sm font-semibold text-mood-good">↗ 6</Text>
            </View>
            <Text className="mt-1 text-sm text-white/45">Steadier than last Tuesday</Text>
          </View>

          <View className="mt-6 flex-row gap-2">
            <MetricPill label="Mood" value="78" accent="good" />
            <MetricPill label="Focus" value="71" accent="warm" />
            <MetricPill label="Drift" value="34" accent="low" />
          </View>

          <View className="mt-6 rounded-card border border-white/[0.08] bg-surface p-5">
            <Text className="text-xl font-bold tracking-tight text-foreground">
              Record today&apos;s reflection
            </Text>
            <Text className="mt-1 text-sm text-white/50">60 seconds is plenty</Text>
            <Pressable className="mt-5 self-start rounded-pill bg-foreground px-5 py-3 active:opacity-70">
              <Text className="font-semibold text-background">◉  Record</Text>
            </Pressable>
          </View>

          <View className="mt-4 rounded-card border border-white/[0.08] bg-surface p-5">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold tracking-tight text-foreground">This week</Text>
              <Text className="text-sm text-white/40">Mood ↗ 4 of 7</Text>
            </View>
            <View className="mt-5 h-16 flex-row items-end justify-between px-1">
              {[22, 35, 29, 44, 38, 52, 61].map((height, index) => (
                <View key={index} className="w-2 rounded-pill bg-mood-warm" style={{ height }} />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
