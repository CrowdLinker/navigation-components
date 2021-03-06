---
id: getting-started
title: Getting started
sidebar_label: Getting started
---

If this is your first time setting up React Native, head over to their docs first: https://facebook.github.io/react-native/docs/getting-started

The supported peer dependencies versions for this library are:

```json
"react": ">=16",
"react-native": ">=0.60",
"react-native-gesture-handler": "^1.4.1",
"react-native-reanimated": "^1.3.0",
"react-native-screens": "^2.0.0-alpha.6"
```

## Installation

In order to get started, there are a few packages that need to be installed:

```bash
yarn add navigation-components
# expo provides these packages by default -- you might already have them!
yarn add react-native-reanimated
yarn add react-native-gesture-handler
yarn add react-native-screens
```

These dependencies are used to provide better animation and gesture performance. They have native implementations so if you are running an iOS build you'll also need to install their Pods:

```bash
cd ios && pod install
```

`react-native-gesture-handler` has some additional setup on Android as well:

https://kmagiera.github.io/react-native-gesture-handler/docs/getting-started.html

## Verifying it's working

Add the following boilerplate to your entry file and swipe away!

```tsx
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';

import { Navigator, Tabs } from 'navigation-components';

const App = () => {
  return (
    <AppContainer>
      <MyNavigator />
    </AppContainer>
  );
};

function MyNavigator() {
  return (
    <Navigator>
      <Tabs>
        <Screen>
          <Text style={styles.title}>Step 1</Text>
        </Screen>
        <Screen>
          <Text style={styles.title}>Step 2</Text>
        </Screen>
        <Screen>
          <Text style={styles.title}>Step 3</Text>
        </Screen>
      </Tabs>
    </Navigator>
  );
}

function AppContainer({ children }: any) {
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
}

function Screen({ children }: any) {
  return <View style={styles.screen}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    marginHorizontal: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
  },
});

export default App;
```

As you can see, we've imported a few components from `navigation-components` and verified that they work. We'll go more in depth on what these are in the next section!
