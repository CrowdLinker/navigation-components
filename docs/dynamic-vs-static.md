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

Note that `createStackNavigator()` returns a _component_. We're unable to update this component from within our app because we can't change the options passed to createStackNavigator(), instead we have to declare everything statically.

We can replicate this API with a relatively simple helper function:

```javascript
// react-navigation actually uses an object as a param here
// we'll use an array to simplify our implementation

function createStackNavigator(routeConfig: IScreenConfig[] = []) {
  const routes = routeConfig.map(route => route.path);
  const screens = routeConfig.map(route => route.screen);

  // we need to return a *component* e.g a function
  return function() {
    // React.Children is used to map a key to each of our children
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

// create our component
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

Nice! Our API is a really oversimplified version of `react-navigation`. If you like this API, it's totally feasible to build out an app with this kind of utility function. And you can configure and tailor it to your app's needs.

But this can be improved. We initially wrote this function to try and replicate the API of `react-navigation`. Notice how we had to return a function from our factory? It feels a little unnecessary in our case since it doesn't really do anything. Let's try refactoring this into a plain component:

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

Now we have a **dynamic** configuration - it lives inside our application as a prop that can change from within out application logic. Again, we can easily modify and create multiple variants on the StackNavigator component, and create similar functionality for Tabs, and Modal.

One advantage of this approach is that it co-locates the `path` with the `screen` component, which can be a little bit easier to grok, and is definitely less error prone than keeping these separate. In any case, you have the option of trying both methods and seeing what works best for you!

## Summary

- `react-navigation` and other libraries using a static routing configuration and API

- You can replicate this API with a helper function if you prefer it. Even better, you can extend the helper function and tailor it to your own app's needs.

- We can refactor our helper function into a component, giving us a dynamic routing configuration that colocates our routes with their screen components

**Note:** These utility functions / components are intentionally left out of the library to encourage you to develop an API and route configs that will work for your app.
