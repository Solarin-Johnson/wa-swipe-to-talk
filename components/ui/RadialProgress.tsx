import React from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  DerivedValue,
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type RadialProgressProps = {
  progress: DerivedValue<number>;
  size?: number;
  strokeWidth?: number;
  color?: string;
};

export const RadialProgress: React.FC<RadialProgressProps> = ({
  progress,
  size = 100,
  strokeWidth = 1.5,
  color = "#25D366",
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <AnimatedCircle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          rotation="-90"
          originX={size / 2}
          originY={size / 2}
        />
      </Svg>
    </View>
  );
};
