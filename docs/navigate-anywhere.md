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

You can even use it in your unit tests to quickly navigate to the screen you're trying to test, or build a navigation service that maps to your particular navigation architecture

## useNavigate

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

This utility might be handy in cases where a navigation is a side-effect of another user action, for example after a user logs in, or after they successfully updated their profile

## Summary

- `navigation-components` exports a global navigate function that can update the location of your app from anywhere. It is recommended to use absolute paths only with this function

- Global navigate could be used to improve debugging, unit tests, and perhaps even in automated workflows.

- The routing model of `navigation-components` supports absolute and relative paths, much like Reach Router. `useNavigate()` can be used inside your components to imperatively update the location of your app
