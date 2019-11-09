---
id: deep-linking
title: Deep Linking
sidebar_label: Deep Linking
---

One really nice benefit of buying into a routing system is that deep linking is pretty much already setup for you on the application side.

This is because the History component is tracking and updating the location of your app just like it would in a browser. Therefore, if you're using routing in your app, you've already setup your deep links without even knowing it - you just need to configure the native code and wire it all together!

Let's start with a basic navigation structure:

```javascript
import React from 'react';
import { History, Navigator, Stack } from 'react-navigation-library';
import { View, Text } from 'react-native';

function App() {
  return (
    <History>
      <View style={{ padding: 20, flex: 1 }}>
        <MyNavigator />
      </View>
    </History>
  );
}

function MyNavigator() {
  return (
    <Navigator>
      <Stack>
        <Screen>
          <Text>Home</Text>
        </Screen>
        <Screen>
          <Text>Settings</Text>
        </Screen>
      </Stack>
    </Navigator>
  );
}

function Screen({ children }) {
  return (
    <View
      style={{
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
      }}
    >
      {children}
    </View>
  );
}

export default App;
```

## Decide on a url scheme

Next, we'll want to decide on a url scheme. Typically, a url will have a scheme and a host, like this: `[scheme]://[host]`. Let's choose `example://app` for our case here.

We can tell our navigation to listen to links with this structure by passing it as a prop to the History component.

```javascript
// setup our app scheme -- pass this to History
const APP_SCHEME = 'example://app';

function App() {
  return (
    <History scheme={APP_SCHEME}>
      <View style={{ padding: 20, flex: 1 }}>
        <MyNavigator />
      </View>
    </History>
  );
}

function MyNavigator() {
  // these routes will be accessible by deep links
  const routes = ['/', 'settings'];

  return (
    <Navigator routes={routes}>
      <Stack>
        <Screen>
          <Text>Home</Text>
        </Screen>
        <Screen>
          <Text>Settings</Text>
        </Screen>
      </Stack>
    </Navigator>
  );
}
```

**Note:** _The routes in your application will be relative to the scheme that you provide. For example, a deep link to `example://app/your/screen` will point to `/your/screen`_

Everything is now setup on the application side. If your app were to open with a deep link to `example://app/setings`, it would navigate to the settings page in our example here.

Next, we'll have to enable deep linking in our app so that they can actually open the link in their respective OS.

## Setup - Android

For Android builds, you'll need to configure your app's `AndroidManifest.xml` file. A default React Native project will look something like this:

```xml
<application
  android:name=".MainApplication"
  android:label="@string/app_name"
  android:icon="@mipmap/ic_launcher"
  android:roundIcon="@mipmap/ic_launcher_round"
  android:allowBackup="false"
  android:theme="@style/AppTheme">
  <activity
    android:name=".MainActivity"
    android:label="@string/app_name"
    android:launchMode="singleTask"
    android:configChanges="keyboard|keyboardHidden|orientation|screenSize"
    android:windowSoftInputMode="adjustResize">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>

  <!-- HERE - this is where you can configure your deep links  -->
    <intent-filter>
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <action android:name="android.intent.action.VIEW" />
        <data android:host="app" android:scheme="example" />
    </intent-filter>


  </activity>
  <activity android:name="com.facebook.react.devsupport.DevSettingsActivity" />
</application>
```

In this case, we've configured a url scheme that looks like this: `example://app` (`[scheme]://[host]`) but you can configure it to whatever you choose, so long as it matches what you've passed to History.

## Setup - iOS

For iOS builds, you'll need to configure your app's `AppDelegate.m` file, as well as the `Info.plist` to register your app scheme. Details for updating the delegate file can be found in the React Native docs:
https://facebook.github.io/react-native/docs/linking.

To configure the scheme, you'll need to update the `Info.plist` dictionary with a new entry like this:

```xml
<!-- Info.plist -->
<!-- ... -->
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleTypeRole</key>
    <string>Editor</string>
    <key>CFBundleURLName</key>
    <string>Example</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>example</string>  <- this is your scheme
    </array>
  </dict>
</array>
```

You might notice that the URLScheme here only contains a scheme and not a host. iOS deep links don't require a host as part of the url, so this part is optional. Deep links will still work as they do on Android, so long as the provided links include both the scheme and host -- e.g `example://app/settings`

## Developing with deep links

Let's test out if our changes worked - launch the app on an Android device or emulator and run the following command in your terminal:

```bash
adb shell am start -W -a android.intent.action.VIEW -d "example://app/settings"
```

For iOS, you'll want to run this command after launching the app in a simulator:

```bash
xcrun simctl openurl booted "example://app/settings"
```

You should see the app snap to the Settings page. If you find yourself needed to run these commands a lot, it's a good idea to include them in your package.json as scripts:

```json
"link:android": "adb shell am start -W -a android.intent.action.VIEW -d",
"link:ios": "xcrun simctl openurl booted"
```

Alternatively, you can open links from the Notes app or Safari in iOS.

**Note:** There's another way to setup deep links on iOS called 'Universal Links' - these require a bit more configuration on your part but there are tons of great resources on the subject.

That's it! While this example was quite basic, know that deep links will work with any screen that you've routed in your application. The commands above can be run while the app is closed or in the foreground. You
can even try navigating around your app purely from the command line if you'd like!

## Summary

- The History component tracks and updates the location similar to how it works in a browser. This means that the routing you've defined in your app is available to be deeply linked.

- In order to setup deep links, you'll need to pass a scheme to the History component - this includes the scheme and host of your deeplinks. At this point, your application is listening for links with the defined schema

- Deep links have some native configuration that you need to setup - this will alert the devices OS to open your app instead of a browser when a user clicks on your link. Android builds require a schema to be defined in the `AndroidManifest.xml` file, while iOS has to update both `AppDelegate.m` and `Info.plist` to start natively listening for deep links.

- Both iOS and Android have shell scripts you can run in your terminal. It's often useful to create shortcuts for these to easily test out deep links with your app.

**Note:** If you need to configure your own implementation for handling deep links, then you can do so by wrapping History in your implementation and passing it an `initialPath` prop instead!
