import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RecordScreen() {
  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1 items-center px-6 pt-8">
        <Text className="text-3xl font-bold tracking-tight text-foreground">Record</Text>
        <Text className="mt-2 text-center text-sm text-white/50">
          A minute is enough to hear yourself clearly.
        </Text>
        <View className="mt-20 h-64 w-64 items-center justify-center rounded-pill border border-mood-warm/20 bg-mood-warm/10">
          <View className="h-44 w-44 items-center justify-center rounded-pill border border-mood-warm/30 bg-mood-warm/20">
            <Text className="text-4xl text-mood-warm">◉</Text>
          </View>
        </View>
        <Text className="mt-10 text-5xl font-light tracking-[-2px] text-foreground">00:00</Text>
        <Pressable className="mt-8 rounded-pill bg-foreground px-8 py-4 active:opacity-70">
          <Text className="font-semibold text-background">Start recording</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}
