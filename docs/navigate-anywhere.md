---
id: navigate-anywhere
title: Navigate anywhere
sidebar_label: Navigate anywhere
---

There are several ways to navigate throughout you app using paths. We've covered some use cases for the Link component already, but `navigation-components` also exports a global `navigate()` function that lets you navigate anywhere in your application, even from outside of a History component. Let's take a look:

## Global navigate

```tsx
import { History, navigate } from 'navigation-components';

function App() {
  return (
    <View>
      <History>
        <MyNavigators />
      </History>

      <Button
        title="To Profile Settings Page"
        onPress={() => navigate('/app/profile/settings')}
      />
    </View>
  );
}
```

Even though Button is outside of our context, we're able to update our app's location. One caveat to this approach is that relative links are not guaranteed to work, so it's a good idea to only pass in absolute paths to the global navigate function.

## Use cases for global navigate

You could enhance your debugging experience by exposing this function to the console:

```tsx
import { navigate } from 'navigation-components';

global.navigate = navigate;
```

Now you can move around in your app in the debugger console if that's something you're interested in doing.

It also means that you could run some automation scripts to navigate throughout your app in a specified sequence of steps. This might be useful if you need to replicate bugs or perhaps run end to end tests.

```tsx
import { navigate } from 'navigation-components';

const steps = ['/home', '/home/profile', '/home/profile/settings'];

steps.map(navigate);
```

You can even use it in your unit tests to quickly navigate to the screen you're trying to test.

## Relative paths

Aside from the global navigate, there are a few other ways to hook into the navigate function.

### Link

We've covered the Link component already, but they can also use relative paths:

```tsx
import { Link } from 'navigation-components';

function MyScreen() {
  return (
    <Link to="../home">
      <Text>Go back</Text>
    </Link>
  );
}
```

This will move the location up one directory and update the location to the home route, much like how it works in Reach Router or using `cd` in your terminal.

### useNavigator

Any child component of a Navigator can call `useNavigator().navigate` to resolve paths relative to the _navigator_:

```tsx
import { useNavigator } from 'navigation-components'

// navigator lives at /app/settings
// screen lives at /app/settings/profile
function MyProfileScreen() {
  const navigator = useNavigator()

  function handleButtonPress() {
    // will navigate to /app
    navigator.navigate('../home')
  }

  return (
    ...
  )
}
```

This navigate function is different from global one because it can handle paths that are relative to where the navigator lives in your app. For example, if your navigator is living at route `/app/settings`, then this handler function would update the app's location to `/home`. Link components operate in the same way - they resolve to routes relative to the _navigator_.

**Note:** You can also pass in absolute paths and they will function much in the same way as the first example.

Relative routes can be really handy when it comes to building reusable subnavigators because your links will work as an independent unit if you happen to move it to another portion of your app.

### useNavigate

You can also use the `useNavigate()` hook which will navigate relative to the _screen_ it's used in.

```tsx
import { useNavigate } from 'navigation-components'

// navigator lives at /app/settings
// screen lives at /app/settings/profile
function MyProfileScreen() {
  const navigate = useNavigate()

  function handleButtonPress() {
    // will navigate to /app/home
    navigate('../home')
  }

  return (
    ...
  )
}
```

#### What is the difference?

`useNavigator()` resolves paths relative to the _navigator_ and `useNavigate()` resolves paths relative to the _screen_. There are some cases where a parent navigator might not be present, for example running a unit test or building an isolated subnavigator, or logically the paths might make more sense.

## Summary

- `navigation-components` exports a global navigate function that can update the location of your app from anywhere. It is recommended to use absolute paths only with this function

- Global navigate could be used to improve debugging, unit tests, and perhaps even in automated workflows.

- The routing model of `navigation-components` supports absolute and relative paths, much like Reach Router. The Link component, `useNavigator()`, and `useNavigate()` can be used inside your components to update the location of your app. `useNavigator()` resolves relative paths from the navigator wheras `useNavigate()` resolves paths from the screen.
