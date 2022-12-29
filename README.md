[![React Native Dark — Formidable, We build the modern web](./react-native-dark-Hero.png)](https://formidable.com/open-source/)

`react-native-dark` is a minor augmentation of `StyleSheet.create` to support dynamic dark-mode styling with little hassle, made possible by babel.

A little, illustrative example:

```tsx
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, world!</Text>
    </View>
  );
}

const styles = createStyleSheet({
  container: {
    flex: 1,
    backgroundColor: "white",
    // 🎉 dark mode 🎉
    $dark: {
      backgroundColor: "black",
    },
  },

  title: {
    color: "black",
    // 🎉 dark mode 🎉
    $dark: {
      color: "white",
    },
  },
});
```

## Setup

Setup involves three steps.

### Step 1: Installation

From a React Native (or Expo) project, install `react-native-dark` from npm:

```shell
npm install react-native-dark # npm
yarn add react-native-dark # yarn
pnpm add react-native-dark # pnpm
```

### Step 2: Add the babel plugin

In your babel configuration (in e.g. `babel.config.js`), add the `react-native-dark` babel plugin:

```js
module.exports = function() {
  return {
    // ...
    plugins: ["react-native-dark/plugin"], // 👈 add this
  };
};
```

### Step 3: Add the TypeScript shim for `StyleSheet.create`

We'll also "shim" the type for `StyleSheet.create` to enhance the developer experience. Add a declaration file to your project, such as `shim.d.ts` and add the following line:

```ts
/// <reference types="react-native-dark/shim" />
```

### Step 4: Go to town!

You're ready to start adding dark-mode styles to your app! See below for more details on usage.

## Usage

The babel plugin and TS shim were built to make adding dark-mode support to your app as easy as just declaring dark-mode styles in your stylesheets. In a standard style declaration, just add a `$dark` field with the styles to be applied in dark mode! These styles will be applied _on top_ of the baseline styles.

```ts
import { StyleSheet } from "react-native";

// ...

const styles = StyleSheet.create({
  card: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "lightblue",
    
    // 🪄 magic happens here 🪄
    $dark: {
      backgroundColor: "blue"
    }
  }
});
```

Now when you call `styles.card` within your function components, the value will be automagically dynamic based on color scheme preference.

### Manually setting color mode

By default, `$dark` styles will be applied when the user's device color scheme preference is set to `dark`. However, you can manually override this behavior by wrapping a component tree in `DarkModeProvider` from `react-native-dark`.

```tsx
import { DarkModeProvider } from "react-native-dark";

// Example of forcing dark mode and ignore user's color scheme preference
const App = () => {
  return (
    <DarkModeProvider colorMode="dark">
      <Body />
    </DarkModeProvider>
  )
}
```

The `DarkModeProvider` has a single `colorMode` prop that can accept:

- `"auto"` (default) to respect user's color scheme preference;
- `"light"` to force light mode;
- `"dark"` to force dark mode.

## 🦄 Magical, but not magic

The babel plugin does the heavy lifting here and will turn code like the following:

```tsx
import { StyleSheet, View } from "react-native";

export const App = () => {
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    
    $dark: {
      backgroundColor: "black"
    }
  }
});
```

into something like this:

```tsx
import { StyleSheet, View } from "react-native";
import { useDarkMode } from "react-native-dark";

export const App = () => {
  const isDark = useDarkMode();
  
  return <View style={isDark ? __styles__container__$dark : styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  __container__$dark: {
    backgroundColor: "black"
  }
});

const __styles__container__$dark = StyleSheet.compose(styles.container, styles.__container__$dark);
```

This is a reasonable and performant approach that you might take _by hand_ if you were implementing dark mode by hand. `react-native-dark` just cuts out the extra code for you. This, however, comes with a limitation or two...

### Limitations

1. Styles should be defined in the same file that they are referenced. E.g., don't import/export your styles object – define them in the same file that they're used.
1. The dynamic support is handled by the `useColorScheme` hook from React Native, therefore this library only currently supports function components.
1. Who knows, we'll probably find more limitations as we go 🤷‍




