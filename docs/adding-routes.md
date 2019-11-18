---
id: adding-routes
title: Adding Routes
sidebar_label: Adding Routes
---

In the last section, we implemented a basic tab navigator. In this section, we'll add some more functionality to it by adding routes. Routes allow us to navigate to a specific screen by its location in the app.

## Using the Link component

`navigation-components` exports a Link component that functions in a similar way to other libraries like Reach Router or Next. Let's add some Links to our screens:

```tsx
import { Link } from 'navigation-components';

// we've move the Tabs component from the previous example back inside our navigator to help illustrate routing
function MyNavigator() {
  return (
    <Navigator>
      <Tabs>
        <Screen>
          <Text style={styles.title}>Step 1</Text>

          <Link to="../step-2">
            <Text style={styles.link}>Go to Step 2</Text>
          </Link>
        </Screen>

        <Screen>
          <Text style={styles.title}>Step 2</Text>

          <Link to="../step-3">
            <Text style={styles.link}>Go to Step 3</Text>
          </Link>
        </Screen>

        <Screen>
          <Text style={styles.title}>Step 3</Text>

          <Link to="../step-1">
            <Text style={styles.link}>Back to Step 1</Text>
          </Link>
        </Screen>
      </Tabs>

      <MyTabbar />
    </Navigator>
  );
}

const styles = StyleSheet.create({
  ...

  link: {
    fontSize: 18,
    color: 'aquamarine',
    textAlign: 'center',
    lineHeight: 24,
  }
})
```

The Link component will wrap our text in a button that links to another screen in the app.

In our example here, we're passing routes that are _relative_ to where the Link lives - try to think of this as you would a `cd` command in your terminal, to get to a sibling directory you'd use a similar path.

## Configuring the navigator

Now all we need to do is configure our Navigator with the routes that we plan on linking:

```tsx
function MyNavigator() {
  return (
    <Navigator routes={['step-1', 'step-2', 'step-3']}>
      {...}
    </Navigator>
  );
}
```

This tells the navigator which routes to listen for, and when the location changes it will find a match and bring it into focus. These routes correspond to the screens that we are rendering in our Tabs component, and so a link directing the app to `/step-1` will bring the first tab into focus.

**Note:** Routes can also specify param tokens e.g `profile/:id`

## Adding a history component

If you just tried the above example, you might have noticed that nothing seems to happen when you press the Links. This is because we're missing one more component:

```tsx
import { History } from 'navigation-components'

function MyNavigator() {
  return (
    <History>
      <Navigator routes={['step-1', 'step-2', 'step-3']}>
        {...}
      </Navigator>
    </History>
  )
}
```

The history component provides a location context for all of the navigators in your app. It allows them to respond to location changes and focus on the right screens.

You'll usually put this at the top level container where your app starts.

## Additional routing options

### Absolute paths

Sometimes you know exactly where a screen will always live in your app. In these cases, you can reach for an absolute path to direct the user to this screen from any other screen.

The Link component considers any path that begins with a `/` as an absolute path.

This might be handy for building reusable components that direct the user to the same screen throughout your app:

```tsx
function HomeButton() {
  return (
    <Link to="/home">
      <Text>Home</Text>
    </Link>
  );
}
```

### Relative roots

Our simple example doesn't demonstrate this, but as you build out a feature you might notice that the paths start to get a little long and unintuitive to follow.

You can wrap any part of your application in a RelativeRoot component to group related screens together, and specify paths relative to this component via the tilde `~/...`:

```tsx
import { RelativeRoot } from 'navigation-components';

function MyNavigator() {
  return (
    <History>
      <RelativeRoot>
        <Navigator routes={['step-1', 'step-2', 'step-3']}>
          <Tabs>
            <Screen>
              <Text style={styles.title}>Step 1</Text>

              <Link to="~/step-2">
                <Text style={styles.link}>Go to Step 2</Text>
              </Link>
            </Screen>

            <Screen>
              <Text style={styles.title}>Step 2</Text>

              <Link to="~/step-3">
                <Text style={styles.link}>Go to Step 3</Text>
              </Link>
            </Screen>

            <Screen>
              <Text style={styles.title}>Step 3</Text>

              <Link to="~/step-1">
                <Text style={styles.link}>Back to Step 1</Text>
              </Link>
            </Screen>
          </Tabs>

          <MyTabbar />
        </Navigator>
      </RelativeRoot>
    </History>
  );
}
```

In cases where there are lots of nested navigators and screens, this can simplify the paths within them a great deal. It also increases reusability and decreases brittle pathing because moving the Link component to a different part of this navigator won't change it's behaviour.

RelativeRoot can wrap multiple different parts of your application where you want to group together screens and simplify the paths within them.

## Summary

- The Link component updates the location of the app via a `path` prop. This path can be relative or absolute depending on your use case. Relative links work similar to how you would navigate your filesystem in the terminal with `cd`.

- In order for links to work, the Navigator must be told which routes it is rendering via the `routes` prop, and then start listening for location changes by wrapping the application in a History component.

- The History component provides a location context for all navigators in the app to respond to, and should usually be placed as a top level component.

- Complex navigation structures can make use of the RelativeRoot component which simplifies paths by grouping related screens together. Paths can make use of the tilde token (e.g `~/my-route/123`) to navigate to different parts of the app relative to the parent relative root. RelativeRoot can used in multiple parts of your app to logically group screens together in this way.
