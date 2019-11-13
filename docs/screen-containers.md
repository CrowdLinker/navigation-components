---
id: screen-containers
title: Rendering screens
sidebar_label: Rendering screens
---

You might have noticed from the previous example that the Tabs component is where your screens are actually rendered. Tabs is one of a few different containers responsible for wrapping your screens and managing the children / gestures from within. Let's take a look at each of these

## Tabs

```tsx
import { Navigator, Tabs } from 'react-navigation-library';

function MyNavigator() {
  return (
    <Navigator>
      <Tabs>
        <Screen>
          <Text>Step 1</Text>
        </Screen>
        <Screen>
          <Text>Step 2</Text>
        </Screen>
        <Screen>
          <Text>Step 3</Text>
        </Screen>
      </Tabs>
    </Navigator>
  );
}
```

The tabs component will render its children horizontally by default, and let the user swipe from one screen to the next. We can alter the configuration of Tabs if we'd like:

```tsx
import { Navigator, Tabs } from 'react-navigation-library';

function MyNavigator() {
  return (
    <Navigator>
      <Tabs
        style={{ width: 200, height: 200, overflow: 'hidden' }}
        type="vertical"
      >
        <Screen>
          <Text>Step 1</Text>
        </Screen>
        <Screen>
          <Text>Step 2</Text>
        </Screen>
        <Screen>
          <Text>Step 3</Text>
        </Screen>
      </Tabs>
    </Navigator>
  );
}
```

Now we have a vertical tabs configuration, which swipes up and down, that is contained within the bounds of a 200x200 square. There are lots of different configuration options available to you here, which will be broken down in detail in the API section of the docs (coming soon).

## Stack

We're not just restricted to tab components however. Let's take a look at a Stack container:

```tsx
import { Navigator, Stack, useStack } from 'react-navigation-library';

function MyStack() {
  return (
    <Navigator>
      <Stack>
        <Screen>
          <Text>Screen 1</Text>
          <PushButton />
        </Screen>

        <Screen>
          <Text>Screen 2</Text>
          <PushButton />
          <PopButton />
        </Screen>

        <Screen>
          <Text>Screen 3</Text>
          <PopButton />
        </Screen>
      </Stack>
    </Navigator>
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

The stack component will stack children one ontop of the other. Users can't swipe to the next stack child, but can swipe back to the previous. A stack will unmount children when they are swiped / popped off of the stack. We can configure the stack in the same way we did the tabs:

```tsx
function MyStack() {
  return (
    <Navigator>
      <Stack style={{ width: 200, height: 200 }} type="vertical">
        ...
      </Stack>
    </Navigator>
  );
}
```

## NativeStack

Sometimes you'll want to include a header component that renders with your screens, or take advantage of the native iOS and Android stack components for performance / styling. It's easy to switch to a native stack:

```tsx
import { Navigator, NativeStack, Header } from 'react-navigation-library';

import { enableScreens } from 'react-native-screens';

enableScreens();

function MyNavigator() {
  return (
    <Navigator>
      <NativeStack>
        <>
          <Header title="1" />
          <Screen>
            <Text>Screen 1</Text>
            <PushButton />
          </Screen>
        </>

        <>
          <Header title="2" />
          <Screen>
            <Text>Screen 2</Text>
            <PushButton />
            <PopButton />
          </Screen>
        </>

        <>
          <Header title="3">
            <Header.Left>Hello</Header.Left>
          </Header>

          <Screen>
            <Text>Screen 3</Text>
            <PopButton />
          </Screen>
        </>
      </NativeStack>
    </Navigator>
  );
}
```

The native stack comes with some default behaviour for handling the styles and back button functionality for us, as well as rendering a title and some other goodies. It doesn't have the exact same configuration options that stack and tabs do - this will also be covered in detail in the API section (coming soon).

There's one more important feature that this example illustrates - each `child` of a container (Tabs, Stack, NativeStack, etc) represents a _single screen_ that can be pushed, popped, swiped to, etc.

## Switch

A switch component can be useful if you want to switch between two screens without any kind of gesture or animation.

Often there are several sibling views that need to be rendered in the same location - for example at paths `/profile/album/1` and `/profile/artist/1` - these might render two totally different components but need to appear in the same part of our app. This is a good use case for using a switch.

Switch serves an additional purpose of offloading CPU/GPU hungry components by taking advantage of the `react-native-screens` library.

```tsx
import { Switch, Navigator, Tabbar, Tab } from 'react-navigation-library';
import { Text } from 'react-native';
import { enableScreens } from 'react-native-screens';

enableScreens();

function MyNavigator() {
  return (
    <Navigator>
      <Switch>
        <Screen>
          <Text>Step 1</Text>
        </Screen>
        <Screen>
          <Text>Step 2</Text>
        </Screen>
        <Screen>
          <Text>Step 3</Text>
        </Screen>
      </Switch>

      <Tabbar>
        <Tab style={{ flex: 1, height: 50 }}>
          <Text>1</Text>
        </Tab>
        <Tab style={{ flex: 1, height: 50 }}>
          <Text>2</Text>
        </Tab>
        <Tab style={{ flex: 1, height: 50 }}>
          <Text>3</Text>
        </Tab>
      </Tabbar>
    </Navigator>
  );
}
```

**Note:** Accessory components like Tabbar and Tab are not restricted in their usage - they can be used in Stack, Tabs, Switch, NativeStack and even Modal

## Modal

A modal serves to display one screen over top of another. It has the same API as Stack and Tabs, with the exception that it only takes two child screens:

```tsx
import { Modal, Navigator, useModal } from 'react-navigation-library';
import { Button } from 'react-native';

function MyNavigator() {
  return (
    <Navigator>
      <Modal>
        <Screen>
          <Text>1</Text>
          <ShowModalButton />
        </Screen>

        <MyModal />
      </Modal>
    </Navigator>
  );
}

function ShowModalButton() {
  const modal = useModal();

  return <Button title="Show modal" onPress={() => modal.show()} />;
}

function MyModal() {
  return (
    <Screen>
      <Text>This is the modal</Text>
    </Screen>
  );
}
```

An active modal can be swiped away by the user, and cannot be swiped to. The `useModal` hook provides methods for toggling the modal, and it can also be triggered using the `active` and `onClose` props:

```tsx
function MyNavigator() {
  const [active, setActive] = React.useState(false);

  return (
    <Navigator>
      <Modal active={active} onClose={() => setActive(false)}>
        ...
      </Modal>
    </Navigator>
  );
}
```

## Summary

- The Tabs container renders screens horizontally and allows users to swipe between them. Tabs can be configured with various different props to alter the behaviour and layout of child screens

- The Stack container works similar to Tabs, but pushes and pops screens off of a stack. These screens are unmounted when they are popped.

- The NativeStack container uses native iOS and Android stack components, and can be used in conjunction with a Header component to render headers with your screens. It has different configuration options than the Stack and Tabs components, and requires `enabledScreens()` to be called somewhere at the top of your app to work.

- The Switch component renders only one screen at a time, and can be used to switch between different sibling screens that exist at the same location in your app. Again, it requires the `enableScreens()` function to be called at the top of your app. Inactive screens are removed from the view heirachy by `react-native-screens` and so performance hungry components can be offloading with this component.

- The Modal component renders one view ontop of another, and can be dismissed with a gesture. It supports the same configurations as Tabs and Stack, but can only receive two child screens. It provides a `useModal()` hook that lets you imperatively toggle the modal, as well as declarative props for modal display.

These are the "primitives" that are at your disposal for managing the screens of your app. They all subscribe to the same contract with Navigator and so all of the rules of routing and navigation apply. More in depth details about configuring each of this will be available in the near future!
