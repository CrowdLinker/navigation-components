---
id: dynamic-vs-static
title: Dynamic vs Static
sidebar_label: Dynamic vs Static
---

In this section, we'll go through the differences between dynamic and static routing configurations. If you're coming from `react-navigation`, a lot of this might look familiar to you

## Creating a navigator in react-navigation

The way you create navigators in `react-navigation` is through factory functions like so:

```javascript
class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
  },
});

export default createAppContainer(AppNavigator);
```

Note that `createStackNavigator()` returns a _component_.

We can replicate this API with a relatively simple helper function:

```javascript
// react-navigation actually uses an object as a param here
// we'll use an array to simplify our implementation

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
        <PopButton />
      </Screen>
    ),
  },
];

// get our component
const MyAppNavigator = createStackNavigator(routeConfig);

// ...and render it
const App = () => {
  return (
    <AppContainer>
      <MyAppNavigator />
    </AppContainer>
  );
};
```

Nice! Our API is a really oversimplified version of `react-navigation`. If you like this API, it's totally doable with this kind of utility function. And you can create lots of different variations and extend its functionality if you'd like.

But this can be improved -- notice how we had to return a function from our factory? It feels a little unnecessary in our case. We did it initially so that we could match the API of `react-navigation`, but what if we refactor it into a plain old component?

```javascript
function StackNavigator({ routeConfig = [] }: IStackNavigatorProps) {
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
```

Now we have a **dynamic** configuration - it lives inside our application as a prop, and can change and update with the rest of our app. Again, we can easily modify and create multiple variants on the StackNavigator component we've just created with relative ease.

## Summary

- `react-navigation` and other libraries using a static routing configuration and API

- You can replicate this API with a helper function if you prefer it. Even better, you can extend the helper function and tailor it to your own needs.

- We can refactor our helper function into a component, giving us a dynamic routing configuration.
