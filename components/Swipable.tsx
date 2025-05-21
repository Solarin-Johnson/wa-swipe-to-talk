import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  Pressable,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useDerivedValue,
  WithSpringConfig,
  withTiming,
} from "react-native-reanimated";
import MessageBox from "./ui/MessageBox";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { RadialProgress } from "./ui/RadialProgress";
import { ThemedText } from "./ThemedText";
import { Image } from "expo-image";

const MAX_DRAW_OFFSET = 150;
const SPRING_CONFIG: WithSpringConfig = {
  damping: 18,
  mass: 1,
  stiffness: 180,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};
const SPRING_CONFIG_SNAP: WithSpringConfig = {
  stiffness: 280,
  damping: 32,
  mass: 0.4,
};
const CIRCULAR_WIDTH = 40;
const CONNECT_WIDTH = 150;
const CONNECT_LARGE_WIDTH = 280;
const CONNECT_HEIGHT = 54;
const CONNECT_LARGE_HEIGHT = 90;

export default function Swipable() {
  const translateY = useSharedValue(0);
  const connected = useSharedValue<boolean>(false);
  const text = useThemeColor({}, "text");
  const textFade = useThemeColor({}, "textFade");
  const error = useThemeColor({}, "error");
  const { bottom, top } = useSafeAreaInsets();

  const iconProps = { color: text };
  const callBtnProps = {
    size: 27,
    ...iconProps,
    style: {
      backgroundColor: text + "16",
      borderRadius: 50,
      padding: 10,
    },
  };

  const progress = useDerivedValue(() => {
    return Math.abs(translateY.value) / MAX_DRAW_OFFSET;
  });

  const maxxed = useDerivedValue(() => {
    return Math.abs(translateY.value) === MAX_DRAW_OFFSET;
  });

  const radialProgress = useDerivedValue<number>(() => {
    return maxxed.value ? withTiming(1, { duration: 1000 }) : 0;
  });

  const countCompleted = useDerivedValue<boolean>(() => {
    return radialProgress.value === 1;
  });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (connected.value) return;
      translateY.value = Math.min(
        0,
        Math.max(-MAX_DRAW_OFFSET, e.translationY)
      );
    })
    .onEnd(() => {
      translateY.value = countCompleted.value
        ? translateY.value
        : withSpring(0, SPRING_CONFIG);
      connected.value = countCompleted.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    height: -translateY.value,
  }));

  const slideAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const msgBoxAnimatedStyle = useAnimatedStyle(() => {
    const shouldAnimate = progress.value > 0.2 && !connected.value;
    return {
      transform: [
        {
          translateY: withSpring(shouldAnimate ? 40 : 0, SPRING_CONFIG),
        },
      ],
      opacity: withSpring(shouldAnimate ? 0 : 1, SPRING_CONFIG),
    };
  });

  const progressAnimatedStyle = useAnimatedStyle(() => {
    const prog = maxxed.value ? 1.2 : Math.min(1, progress.value * 2);
    return {
      transform: [
        {
          scale: withSpring(prog, {
            ...(prog < 1 ? { duration: 0 } : SPRING_CONFIG),
          }),
        },
      ],
    };
  });

  const arrowStyle = useAnimatedStyle(() => ({
    opacity: withSpring(maxxed.value ? 0 : 1, SPRING_CONFIG),
  }));

  const bubbleStyle = useAnimatedStyle(() => ({
    opacity: withSpring(maxxed.value ? 1 : 0, SPRING_CONFIG),
  }));

  const connectAnimatedStyle = useAnimatedStyle(() => {
    const scale = countCompleted.value ? 1 : 0;
    return {
      width: withSpring(
        connected.value ? CONNECT_LARGE_WIDTH : CONNECT_WIDTH,
        SPRING_CONFIG
      ),
      height: withSpring(
        connected.value ? CONNECT_LARGE_HEIGHT : CONNECT_HEIGHT,
        SPRING_CONFIG
      ),
      transform: [
        {
          scale: withSpring(scale, SPRING_CONFIG),
        },
      ],
    };
  });

  const connectInnerStyle = useAnimatedStyle(() => ({
    opacity: withSpring(connected.value ? 0 : 1, SPRING_CONFIG_SNAP),
    transform: [
      {
        translateY: withSpring(
          connected.value ? -CONNECT_HEIGHT / 4 : 0,
          SPRING_CONFIG_SNAP
        ),
      },
    ],
  }));
  const callConnectStyle = useAnimatedStyle(() => ({
    opacity: withSpring(connected.value ? 1 : 0, SPRING_CONFIG_SNAP),
  }));

  const onCLose = () => {
    translateY.value = withSpring(0, SPRING_CONFIG, () => {
      connected.value = false;
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <GestureDetector gesture={panGesture}>
        <View style={{ flex: 1 }}>
          <Animated.View
            style={[
              styles.swipable,
              { marginTop: top + 12 },
              slideAnimatedStyle,
            ]}
          >
            <ThemedText>Swipable</ThemedText>
          </Animated.View>
          <Animated.View
            style={[
              {
                position: "absolute",
                bottom: 0,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
              },
              animatedStyle,
            ]}
          >
            <Animated.View
              style={[
                styles.progressIndicator,
                { backgroundColor: text + "30" },
                progressAnimatedStyle,
              ]}
            >
              <Animated.View style={[styles.icon, arrowStyle]}>
                <FontAwesome6 name="arrow-up" size={16} {...iconProps} />
              </Animated.View>
              <Animated.View style={[styles.icon, bubbleStyle]}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={22}
                  {...iconProps}
                />
              </Animated.View>
              <RadialProgress
                progress={radialProgress}
                size={CIRCULAR_WIDTH + 2}
              />
            </Animated.View>
            <Animated.View
              style={[
                styles.connect,
                { backgroundColor: textFade },
                connectAnimatedStyle,
              ]}
            >
              <Animated.View style={[styles.connectInner, connectInnerStyle]}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={27}
                  {...iconProps}
                />
                <ThemedText type="defaultSemiBold">Connect</ThemedText>
              </Animated.View>
              <Animated.View style={[styles.connectCall, callConnectStyle]}>
                <Ionicons name="mic-off" {...callBtnProps} />
                <View style={{ flex: 1, alignItems: "center", rowGap: 6 }}>
                  <Image
                    source={require("@/assets/images/dp.png")}
                    style={{ width: 48, aspectRatio: 1, borderRadius: 50 }}
                  />
                  <ThemedText
                    type="defaultSemiBold"
                    style={{ fontSize: 13, opacity: 0.5 }}
                  >
                    Connecting...
                  </ThemedText>
                </View>
                <Pressable onPress={onCLose}>
                  <Ionicons name="close" {...callBtnProps} color={error} />
                </Pressable>
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </View>
      </GestureDetector>
      <Animated.View style={[msgBoxAnimatedStyle, { paddingBottom: bottom }]}>
        <MessageBox />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  swipable: {
    backgroundColor: "#80808020",
    padding: 20,
    borderRadius: 12,
    flex: 1,
    margin: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  progressIndicator: {
    alignSelf: "center",
    width: CIRCULAR_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    aspectRatio: 1,
    borderRadius: 50,
  },
  icon: {
    position: "absolute",
  },
  connect: {
    position: "absolute",
    borderRadius: CONNECT_HEIGHT / 2,
    alignItems: "center",
    overflow: "hidden",
  },
  connectInner: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    height: CONNECT_HEIGHT,
    width: CONNECT_WIDTH,
    position: "absolute",
  },
  connectCall: {
    width: CONNECT_LARGE_WIDTH,
    height: CONNECT_LARGE_HEIGHT,
    padding: 8,
    flexDirection: "row",
    alignItems: "flex-start",
  },
});
