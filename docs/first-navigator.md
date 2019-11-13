---
id: first-navigator
title: Basic Example
sidebar_label: Basic Example
---

In the previous section, we installed the library and ensured it was working. Here is what it looks like:

```tsx
import { Navigator, Tabs } from 'navigation-components';

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
```

It's clear that the Tabs component has grouped our screens so that we can swipe between them. This is great, but it doesn't do much yet, so let's add some functionality to it. Ideally we'll want a tabbar to be able to navigate between screens

## Adding a tabbar

Let's extend our example by importing Tabbar and Tab:

```tsx
import { Tabbar, Tab } from 'navigation-components';

// extract the Tabs from above into a component for better visibility
function MyTabs() {
  return (
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
  );
}

// create a tabbar to work with our tabs:
function MyTabbar() {
  return (
    <Tabbar>
      <Tab style={styles.tab}>
        <Text>1</Text>
      </Tab>
      <Tab style={styles.tab}>
        <Text>2</Text>
      </Tab>
      <Tab style={styles.tab}>
        <Text>3</Text>
      </Tab>
    </Tabbar>
  );
}

function MyNavigator() {
  return (
    <Navigator>
      <MyTabs />
      <MyTabbar />
    </Navigator>
  );
}

// add our custom styles for a tab:
const styles = StyleSheet.create({
  // ...

  tab: {
    height: 50,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

You'll notice that our Tab components will now navigate to the correct screen based on their _order_, and we have a way to navigate without needing to swipe.

Say you want the Tabbar to be on the top of your tabs instead of below it. All you need to do is switch the order in your markup:

```tsx
function MyNavigator() {
  return (
    <Navigator>
      <MyTabbar />
      <MyTabs />
    </Navigator>
  );
}
```

This simple example showcases the declarative nature of this library - you can render _any_ components you'd like within a Navigator. Think of it as a way of grouping related screens in your application. It doesn't render anything itself, but provides _context_ to it's children and let's us define how they are connected.

## Adding routes

At some point, you'll need to navigate from one screen to another with more than just a Tabbar. We can do this by telling our Navigator what routes to listen for, and then link to them from any component inside of our Navigator:

```tsx
import { Link } from 'navigation-components';

// define the routes that will map to our screens:
const routes = ['one', 'two', 'three'];

function MyNavigator() {
  return (
    <Navigator routes={routes}>
      <MyTabs />
      <MyTabbar />
    </Navigator>
  );
}

// wrap our text content in a Link tag:
function MyTabs() {
  return (
    <Tabs>
      <Screen>
        <Link to="two">
          <Text style={styles.title}>Step 1</Text>
        </Link>
      </Screen>

      <Screen>
        <Link to="three">
          <Text style={styles.title}>Step 2</Text>
        </Link>
      </Screen>

      <Screen>
        <Link to="one">
          <Text style={styles.title}>Step 3</Text>
        </Link>
      </Screen>
    </Tabs>
  );
}
```

Now the Navigator knows which route maps to which screen, so our Links should be able to update the active screen. Yet it still doesn't seem to work. This is because there is one additional component required to keep your routing in sync - **History** is a provider component that (usually) will wrap around your entire application, similar to what you would use in React-Router

```tsx
import { History } from 'navigation-components';

// this component wraps our whole application
function AppContainer({ children }: any) {
  return (
    <History>
      <SafeAreaView style={styles.container}>{children}</SafeAreaView>
    </History>
  );
}
```

**Note:** _It's usually a good idea to wrap your top-most App component in a History provider as it will provide the context for all of your Navigators to work together._

Our navigator is looking pretty good at this point. We can swipe between screens, tap on a tab, and navigate from within any child component. Here is everything we just wrote:

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

import {
  Navigator,
  Tabs,
  Tabbar,
  Tab,
  Link,
  History,
} from 'navigation-components';

const App = () => {
  return (
    <AppContainer>
      <MyNavigator />
    </AppContainer>
  );
};

const routes = ['one', 'two', 'three'];

function MyNavigator() {
  return (
    <Navigator routes={routes}>
      <MyTabs />
      <MyTabbar />
    </Navigator>
  );
}

function MyTabs() {
  return (
    <Tabs>
      <Screen>
        <Link to="two">
          <Text style={styles.title}>Step 1</Text>
        </Link>
      </Screen>
      <Screen>
        <Link to="three">
          <Text style={styles.title}>Step 2</Text>
        </Link>
      </Screen>
      <Screen>
        <Link to="one">
          <Text style={styles.title}>Step 3</Text>
        </Link>
      </Screen>
    </Tabs>
  );
}

function MyTabbar() {
  return (
    <Tabbar>
      <Tab style={styles.tab}>
        <Text>1</Text>
      </Tab>
      <Tab style={styles.tab}>
        <Text>2</Text>
      </Tab>
      <Tab style={styles.tab}>
        <Text>3</Text>
      </Tab>
    </Tabbar>
  );
}

function AppContainer({ children }: any) {
  return (
    <History>
      <SafeAreaView style={styles.container}>{children}</SafeAreaView>
    </History>
  );
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

  tab: {
    height: 50,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
```

## Summary

- The Tabs component is responsible for rendering our screens, and provides niceties like gesture handling and layout

- The Tabbar and Tab components provide a way to navigate to different screens base on their order

- The Navigator component is used to group related screens together. It doesn't render anything itself, but provides a relative context for children

- You can link screens together by defining the routes of a Naviagor, and then navigate to them using a Link component. In order for this to work, you must wrap your Navigator in a History component
