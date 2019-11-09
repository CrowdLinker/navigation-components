---
id: first-navigator
title: Basic Example
sidebar_label: Basic Example
---

In the previous section, we installed the library and ensured it was working. The provided example included a few components exported by `react-navigation-library`. Let's take a look at those:

```javascript
import { Navigator, Tabs } from 'react-navigation-library';

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

Looking at the result, it's clear that the Tabs component has grouped our screens so that we can swipe between them. This is great, but ideally we'll want a tabbar to be able to navigate between screens as well.

## Adding a tabbar

Let's extend our example by importing Tabbar and creating our own simple Tab component:

```javascript
import { Tabbar, Tab } from 'react-navigation-library';

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

      <Tabbar>
        <Tab>
          <Text style={styles.tab}>1</Text>
        </Tab>
        <Tab>
          <Text style={styles.tab}>2</Text>
        </Tab>
        <Tab>
          <Text style={styles.tab}>3</Text>
        </Tab>
      </Tabbar>
    </Navigator>
  );
}
```

You'll notice that our Tab components will now navigate to the correct screen based on their order, and we have a way to navigate without needing to swipe!

Still, it's not quite clear yet what Navigator is doing for us in all of this. So let's try and think of a different example - say you want the Tabbar to be on the top of your tabs instead of below it. All you need to do is switch the order in your markup:

```javascript
const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Navigator>
        {/* Tabbar is up here now */}
        <Tabbar style={styles.tabbar}>
          <Tab text="1" />
          <Tab text="2" />
          <Tab text="3" />
          <Tab text="4" />
        </Tabbar>

        <Tabs style={styles.container}>
          <Screen title="Step 1" />
          <Screen title="Step 2" />
          <Screen title="Step 3" />
          <Screen title="Step 4" />
        </Tabs>
      </Navigator>
    </SafeAreaView>
  );
};
```

Everything else remains the same, and the Tabbar works as expected. This case is a simplified example, but hopefully it's clear that you can render **_any_** component you'd like, it's completely declarative. This is the value that Navigator provides: it let's us declaratively group related components in the same context.

## Adding routes

While the Tabbar is a common and super useful way of navigating to different screens, it's often the case you need to navigate from one screen to another within a screen. To do so, we'll need to configure the Navigator a little bit more. Let's try it out:

```javascript
import { Link } from 'react-navigation-library';

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Navigator>
        <Tabs style={styles.container}>
          <Screen title="Step 1">
            <Link to="two">
              <Text>Next</Text>
            </Link>
          </Screen>

          <Screen title="Step 2">
            <Link to="three">
              <Text>Next</Text>
            </Link>
          </Screen>

          <Screen title="Step 3">
            <Link to="four">
              <Text>Next</Text>
            </Link>
          </Screen>

          <Screen title="Step 4">
            <Link to="one">
              <Text>First</Text>
            </Link>
          </Screen>
        </Tabs>

        <Tabbar style={styles.tabbar}>
          <Tab text="1" />
          <Tab text="2" />
          <Tab text="3" />
          <Tab text="4" />
        </Tabbar>
      </Navigator>
    </SafeAreaView>
  );
};
```

The Link component renders our text but it doesn't seem to do anything, which makes sense because we are providing links but haven't said anything about what the routes are. We can do this by defining routes for the Navigator:

```javascript
import { Link } from 'react-navigation-library';

// Define the routes of our Navigator so that links will work:
const routes = ['one', 'two', 'three', 'four'];

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* pass the routes to Navigator */}
      <Navigator routes={routes}>
        <Tabs style={styles.container}>
          <Screen title="Step 1">
            <Link to="two">
              <Text>Next</Text>
            </Link>
          </Screen>

          <Screen title="Step 2">
            <Link to="three">
              <Text>Next</Text>
            </Link>
          </Screen>

          <Screen title="Step 3">
            <Link to="four">
              <Text>Next</Text>
            </Link>
          </Screen>

          <Screen title="Step 4">
            <Link to="one">
              <Text>First</Text>
            </Link>
          </Screen>
        </Tabs>

        <Tabbar style={styles.tabbar}>
          <Tab text="1" />
          <Tab text="2" />
          <Tab text="3" />
          <Tab text="4" />
        </Tabbar>
      </Navigator>
    </SafeAreaView>
  );
};
```

Now the Navigator knows which route maps to which screen, so our Links should be able to update the active screen. Yet it still doesn't seem to work. This is because there is one additional component required to keep your routing in sync - **History** is a provider component that (usually) will wrap around your entire application, similar to what you would use in React-Router

```javascript
import { History } from 'react-navigation-library';

const routes = ['one', 'two', 'three', 'four'];

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <History>
        <Navigator routes={routes}>
          <Tabs style={styles.container}>
            <Screen title="Step 1">
              <Link to="two">
                <Text>Next</Text>
              </Link>
            </Screen>

            <Screen title="Step 2">
              <Link to="three">
                <Text>Next</Text>
              </Link>
            </Screen>

            <Screen title="Step 3">
              <Link to="four">
                <Text>Next</Text>
              </Link>
            </Screen>

            <Screen title="Step 4">
              <Link to="one">
                <Text>First</Text>
              </Link>
            </Screen>
          </Tabs>

          <Tabbar style={styles.tabbar}>
            <Tab text="1" />
            <Tab text="2" />
            <Tab text="3" />
            <Tab text="4" />
          </Tabbar>
        </Navigator>
      </History>
    </SafeAreaView>
  );
};
```

It's usually a good idea to wrap your topmost App component in a History provider as it will provide the context for all of your Navigators to work together

## Summary

- The Tabs component is responsible for rendering screens within its container, and provides niceties like gesture handling and layout.

- The Tabbar component provides a way to declaratively navigate to different screens through a button press, rather than just using gestures.

- The Navigator component is used to group related screens together. It doesn't render anything itself, but provides a relative context for children.

- You can provide routes to Navigator and navigate to them using a Link component. In order for this to work, you must wrap your application in a History component.

Even though this example is overly simplistic, there are some fundamental values that it demonstrates.

For example, while we used the Link component to navigate to relative screens like `two` and `three`, it also can link to parent screens like `../home` or anywhere in your app such as `/settings/profile`.

And while we rendered simple views as our screens, those views could be anything that you like, and you can render anything you'd like around them. We could even compose this Navigator and render the same one inside of it, and both would work as expected.

The remaining examples will go through a few more functions at your disposable, as well as some different ways of configuring and customizing the behaviour of your app, common patterns, and other cool stuff!
