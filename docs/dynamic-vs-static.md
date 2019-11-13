---
id: dynamic-vs-static
title: Build your own Navigator
sidebar_label: Build your own Navigator
---

This section shows some of the flexibility that is at your disposable with `navigation-components`. Let's build out a custom navigator API.

## Creating a static navigator

We can write a factory function similar to what you might have seen in `react-navigation` like so:

```javascript
// react-navigation actually uses an object as a param here
// we'll use an array to simplify our implementation

function createStackNavigator(routeConfig: IScreenConfig[] = []) {
  const routes = routeConfig.map(route => route.path);
  const screens = routeConfig.map(route => route.screen);

  // return a *component* e.g a function
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

If you like this API, it's totally feasible to build out an app with this kind of utility function. And the best part is that you can configure and tailor these functions to your needs.

## Make your navigator dynamic

Notice how we had to return a function from our factory? It feels a little unnecessary in our case since it doesn't really do anything. Let's try refactoring this into a plain component:

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

Now we have a **dynamic** navigator component which lives inside our application. We can easily modify and create different configurations to suit our needs.

One advantage of this API is that it co-locates the `path` with the `screen` component, which can be a little bit easier to grok, and is definitely less error prone than keeping these separate. In any case, you have the option of trying both methods and seeing what works best for you!

## Summary

- You can easily write your own helper function to build out a static navigator. Even better, you can extend and tailor it to your own app's needs.

- This function can be refactored into a component, giving us a dynamic routing configuration that colocates our routes with their screen components

**Note:** These utility functions / components are intentionally left out of the library to encourage you to develop an API and route configs that will work for your app.
