/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {StyleSheet, View, Text, SafeAreaView, Button} from 'react-native';

import {
  Navigator,
  Tabs,
  Tabbar,
  Tab,
  Link,
  History,
  Stack,
  useStack,
  Modal,
  useModal,
} from 'react-navigation-library';

interface IScreenConfig {
  path: string;
  screen: React.ReactElement<any>;
}

const routeConfig = [
  {
    path: '/',
    screen: (
      <Screen>
        <Text>Home</Text>
        <PushButton />
      </Screen>
    ),
  },

  {
    path: 'settings',
    screen: (
      <Screen>
        <Text>Settings</Text>
        <PushButton />
        <PopButton />
      </Screen>
    ),
  },
];

function createStackNavigator(routeConfig: IScreenConfig[] = []) {
  const routes = routeConfig.map(route => route.path);
  const screens = routeConfig.map(route => route.screen);

  // we need to return a *component*
  return function() {
    return (
      <Navigator routes={routes}>
        <Stack>{React.Children.map(screens, screen => screen)}</Stack>
      </Navigator>
    );
  };
}

function StackNavigator({routeConfig = []}: {routeConfig: IScreenConfig[]}) {
  const routes = routeConfig.map(route => route.path);
  const screens = routeConfig.map(route => route.screen);

  return (
    <Navigator routes={routes}>
      <Stack>{React.Children.map(screens, screen => screen)}</Stack>
    </Navigator>
  );
}

const App = () => {
  return (
    <AppContainer>
      <StackNavigator routeConfig={routeConfig} />
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

function AppContainer({children}: any) {
  return (
    <History scheme="example://app">
      <SafeAreaView style={styles.container}>{children}</SafeAreaView>
    </History>
  );
}

function Screen({children}: any) {
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

  tab: {
    height: 50,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;

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

function MyModalNavigator({children}) {
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
