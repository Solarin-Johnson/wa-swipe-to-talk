/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const globalColor = {
  primary: "#25D366",
};

export const Colors = {
  light: {
    text: "#11181C",
    background: "#E9E7E7",
    barColor: "#ffffff",
    textFade: "#C1C0C1",
    error: "#9E313C",
    ...globalColor,
  },
  dark: {
    text: "#ECEDEE",
    background: "#121212",
    barColor: "#222222",
    textFade: "#383838",
    error: "#FF7373",
    ...globalColor,
  },
};
