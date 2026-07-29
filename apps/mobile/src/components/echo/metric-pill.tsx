import { Text, View } from 'react-native';

type MetricAccent = 'good' | 'warm' | 'low';

const accentClasses: Record<MetricAccent, string> = {
  good: 'border-mood-good/35 bg-mood-good/10',
  warm: 'border-mood-warm/35 bg-mood-warm/10',
  low: 'border-mood-low/35 bg-mood-low/10',
};

type MetricPillProps = {
  label: string;
  value: string;
  accent: MetricAccent;
};

export function MetricPill({ label, value, accent }: MetricPillProps) {
  return (
    <View className={`min-h-[70px] flex-1 items-center justify-center rounded-pill border ${accentClasses[accent]}`}>
      <Text className="text-xs text-white/50">{label}</Text>
      <Text className="mt-0.5 text-lg font-semibold text-foreground">{value}</Text>
    </View>
  );
}
