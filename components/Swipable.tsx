import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import MessageBox from "./ui/MessageBox";

export default function Swipable() {
  const translateY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      translateY.value = 0;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={panGesture}>
        <Animated.ScrollView style={[styles.swipable, animatedStyle]}>
          <Text>Swipable</Text>
        </Animated.ScrollView>
      </GestureDetector>
      <MessageBox />
    </View>
  );
}

const styles = StyleSheet.create({
  swipable: {
    // backgroundColor: "#eee",
    padding: 20,
    borderRadius: 10,
    // alignItems: "center",
    flex: 1,
  },
});
