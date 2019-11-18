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

## Flexible markup

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

So far our implementation supports swiping and tapping to navigate between screens. It's still pretty basic, but it's also really flexible.

Ideally we'd like some more control over navigating to different screens. We'll add this functionality with routing in the next section.

## Summary

- The Tabs component is responsible for rendering our screens, and provides niceties like gesture handling and layout

- The Tabbar and Tab components provide a way to navigate to different screens base on their order

- The Navigator component is used to group related screens together. It doesn't render anything itself, but provides a relative context for children
