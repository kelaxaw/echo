import { View } from 'react-native';

export function MoodOrb() {
  return (
    <View className="h-52 w-52 items-center justify-center">
      <View className="absolute h-52 w-52 rounded-pill bg-mood-warm/10" />
      <View className="absolute h-44 w-44 rounded-pill bg-mood-warm/20" />
      <View className="h-36 w-36 rounded-pill border border-white/20 bg-mood-warm shadow-2xl shadow-mood-warm/50">
        <View className="absolute left-7 top-5 h-12 w-12 rounded-pill bg-white/70 opacity-80" />
        <View className="absolute bottom-0 left-0 right-0 h-20 rounded-pill bg-black/30" />
      </View>
      <View className="absolute bottom-0 h-5 w-28 rounded-pill bg-mood-warm/30" />
    </View>
  );
}
