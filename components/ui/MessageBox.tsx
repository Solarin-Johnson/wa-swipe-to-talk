import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function MessageBox() {
  const { bottom } = useSafeAreaInsets();
  const text = useThemeColor({}, "text");
  const barColor = useThemeColor({}, "barColor");
  const bg = useThemeColor({}, "background");

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: bottom + 6,
        },
      ]}
    >
      <View style={[styles.inputBox, { backgroundColor: barColor }]}>
        <Ionicons
          name="happy-outline"
          size={24}
          color="gray"
          style={[styles.icon]}
        />
        <TextInput
          style={[styles.textInput, { color: text }]}
          placeholder="Type a message"
          placeholderTextColor="#888"
        />
        <TouchableOpacity>
          <Ionicons
            name="attach"
            size={24}
            color="gray"
            style={styles.iconSet}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="camera-outline"
            size={24}
            color="gray"
            style={styles.iconSet}
          />
        </TouchableOpacity>
      </View>
      <Pressable style={styles.micButton}>
        <MaterialIcons name="keyboard-voice" size={25} color={bg} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 12,
  },
  inputBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    paddingHorizontal: 10,
    marginRight: 8,
    minHeight: 48,
  },
  icon: {
    marginHorizontal: 2,
  },
  iconSet: {
    marginHorizontal: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  micButton: {
    backgroundColor: "#25D366",
    borderRadius: 25,
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
});
