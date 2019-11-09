---
id: nesting-navigators
title: Nesting Navigators
sidebar_label: Nesting Navigators
---

In this example we'll explore using the Stack and Modal components in tandem. Let's start with a fresh application:

```javascript
import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';

import { History } from 'react-navigation-library';

const App = () => {
  return (
    <AppContainer>
      <MyStackNavigator />
    </AppContainer>
  );
};

// we'll implement this
function MyStackNavigator() {
  return null;
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
    backgroundColor: 'white',
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default App;
```

## Adding a stack

We'll start with using a Stack component. It's very similar to the Tabs component we used in the previous section - in fact the API is exactly the same, you can switch out a Tabs for a Stack anywhere you'd like.

```javascript
import { Button } from 'react-native';
import { Navigator, Stack, useStack } from 'react-navigation-library';

function MyStackNavigator() {
  return (
    <Navigator>
      <MyStack />
    </Navigator>
  );
}

function MyStack() {
  return (
    <Stack>
      <Screen>
        <Text style={styles.title}>Screen 1</Text>
        <PushButton />
      </Screen>

      <Screen>
        <Text style={styles.title}>Screen 2</Text>
        <PushButton />
        <PopButton />
      </Screen>

      <Screen>
        <Text style={styles.title}>Screen 3</Text>
        <PopButton />
      </Screen>
    </Stack>
  );
}

// we can use the useStack() hook to push and pop views from any component inside of Stack
function PushButton() {
  const stack = useStack();

  return <Button title="Push" onPress={() => stack.push()} />;
}

function PopButton() {
  const stack = useStack();

  return <Button title="Pop" onPress={() => stack.pop()} />;
}
```

As you can hopefully see, the Stack component stacks its screens ontop of one another. What you can't see visually is that the Stack component **unmounts** screens when they are pushed off of the stack.

This means that a Stack component has a different use case than Tabs - generally you'll want a stack when your screens have a logical order to them, for example a multipage form, or a profile view that appears over top of an index page.

## Adding a modal

Now lets add a popover modal to appear ontop of our Stack:

```javascript
import { Modal, useModal, Navigator } from 'react-navigation-library';

// the modal will be the last child of the <Modal /> component:
// we can easily append it to the end by adding it after our children
function MyModalNavigator({ children }) {
  return (
    <Navigator>
      <Modal>
        {children}
        <MyModal />
      </Modal>
    </Navigator>
  );
}

// useModal() has show() and hide() methods that will toggle the modal
function MyModal() {
  const modal = useModal();

  return (
    <Screen>
      <Text style={styles.title}>This is the modal!</Text>
      <Button title="Dismiss" onPress={() => modal.hide()} />
    </Screen>
  );
}

function ShowModalButton() {
  const modal = useModal();

  return <Button title="Show Modal" onPress={() => modal.show()} />;
}

// group our button with the stack navigator and wrap it in the modal
const App = () => {
  return (
    <AppContainer>
      <MyModalNavigator>
        <>
          <MyStackNavigator />
          <ShowModalButton />
        </>
      </MyModalNavigator>
    </AppContainer>
  );
};
```

Now we can toggle the modal, swipe down to dismiss or take advantage of the `useModal()` hook anywhere inside of our Modal component.

## Adding routes

Just like in the previous section, we can add routing to the navigators we've just created. This might be useful if you'd like to navigate directly to a screen that is further down in the Stack, or perhaps want to trigger a modal via a link. Lets look at setting this up.

```javascript
import { Link } from 'react-navigation-library';

function MyModalNavigator({ children }) {
  const routes = ['/', 'modal'];

  return (
    <Navigator routes={routes}>
      <Modal>
        {children}
        <MyModal />
      </Modal>
    </Navigator>
  );
}

function MyStackNavigator() {
  const routes = ['one', 'two', 'three'];

  return (
    <Navigator routes={routes}>
      <MyStack />
    </Navigator>
  );
}

// add some links to our stack screens and a modal link ontop of our screens
function MyStack() {
  return (
    <>
      <Link to="/modal">
        <Text style={styles.title}>Modal Link</Text>
      </Link>

      <Stack>
        <Screen>
          <Link to="two">
            <Text style={styles.title}>Screen 1 (Link)</Text>
          </Link>

          <PushButton />
        </Screen>

        <Screen>
          <Link to="three">
            <Text style={styles.title}>Screen 2 (Link)</Text>
          </Link>

          <PushButton />
          <PopButton />
        </Screen>

        <Screen>
          <Link to="one">
            <Text style={styles.title}>Screen 3 (Link)</Text>
          </Link>

          <PopButton />
        </Screen>
      </Stack>
    </>
  );
}
```

We've successfully composed our navigators and wired them up together! Here's the code we wrote:

```javascript
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, Button } from 'react-native';

import {
  Navigator,
  Link,
  History,
  Stack,
  useStack,
  Modal,
  useModal,
} from 'react-navigation-library';

const App = () => {
  return (
    <AppContainer>
      <MyModalNavigator>
        <>
          <MyStackNavigator />
          <ShowModalButton />
        </>
      </MyModalNavigator>
    </AppContainer>
  );
};

function MyStackNavigator() {
  const routes = ['one', 'two', 'three'];

  return (
    <Navigator routes={routes}>
      <MyStack />
    </Navigator>
  );
}

function MyStack() {
  return (
    <>
      <Link to="/modal">
        <Text style={styles.title}>Modal Link</Text>
      </Link>

      <Stack>
        <Screen>
          <Link to="two">
            <Text style={styles.title}>Screen 1 (Link)</Text>
          </Link>

          <PushButton />
        </Screen>

        <Screen>
          <Link to="three">
            <Text style={styles.title}>Screen 2 (Link)</Text>
          </Link>

          <PushButton />
          <PopButton />
        </Screen>

        <Screen>
          <Link to="one">
            <Text style={styles.title}>Screen 3 (Link)</Text>
          </Link>

          <PopButton />
        </Screen>
      </Stack>
    </>
  );
}

function PushButton() {
  const stack = useStack();

  return <Button title="Push" onPress={() => stack.push()} />;
}

function PopButton() {
  const stack = useStack();

  return <Button title="Pop" onPress={() => stack.pop()} />;
}

function MyModalNavigator({ children }) {
  const routes = ['/', 'modal'];

  return (
    <Navigator routes={routes}>
      <Modal>
        {children}
        <MyModal />
      </Modal>
    </Navigator>
  );
}

// useModal() has show() and hide() methods that will toggle the modal
function MyModal() {
  const modal = useModal();

  return (
    <Screen>
      <Text style={styles.title}>This is the modal!</Text>

      <Button title="Dismiss" onPress={() => modal.hide()} />
    </Screen>
  );
}

function ShowModalButton() {
  const modal = useModal();

  return <Button title="Show Modal" onPress={() => modal.show()} />;
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
    backgroundColor: 'white',
  },

  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default App;
```

## Summary

- The Stack component is a lot like the Tabs component, but it can push and pop views off of the itself. This means it unmounts screens that are not active, and is a good candidate for navigators that have a clear logical order, like a multipage form.

- `useStack()` is a hook that can push and pop views in a Stack

- The Modal component can be used to display a modal over top of some content. The modal screen will be whatever the you render as the last child of Modal. It's also very similar in API to Stack and Tabs

- `useModal()` is a hook that can show and hide the modal

- Modal and Stack are consumers of Navigator - just like Tabs, and so they can be configured to listen for routes and we can take advantage of the Link component and wire their views together.

- Navigators can be **composed**, a Stack can be used within a Modal, a Modal within a Stack within a Tabs - any combination that you can imagine!
