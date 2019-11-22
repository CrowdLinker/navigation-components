---
id: sibling-tabs
title: Swipeable feeds
sidebar_label: Swipeable feeds
---

Building on the last section, we'll implement a set of sibling tab components that render different sets of feeds. This example is inspired by the Spotify mobile app's library tab, which has a similar setup.

Here's what we'll be building:

<img src="/navigation-components/docs/assets/spotify-tabs.gif" width="350" />

## Setting up the parent tabs

This UI contains several tab components nested within eachother. Starting from the top it looks like we'll need a tabs component for 'Music' and 'Podcasts', so let's start there:

```tsx
import { Tabs, Navigator, Tabbar, Tab } from 'navigation-components';
import { StyleSheet, SafeAreaView, Text, View } from 'react-native';

function SpotifyTabs() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Navigator>
        <Tabbar>
          <TextTab>music</TextTab>
          <TextTab>podcasts</TextTab>
        </Tabbar>

        <Tabs>
          <TabPanel>
            <Title>Music Tab</Title>
          </TabPanel>
          <TabPanel>
            <Title>Podcasts Tab</Title>
          </TabPanel>
        </Tabs>
      </Navigator>
    </SafeAreaView>
  );
}

function TextTab({ children }) {
  return (
    <Tab style={{ padding: 10 }}>
      <Text style={styles.tab}>{children}</Text>
    </Tab>
  );
}

function Title({ children }) {
  return <Text style={styles.title}>{children}</Text>;
}

function TabPanel({ children }) {
  return <View style={styles.centered}>{children}</View>;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tab: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});
```

## Adding child tabs

Now it becomes a little bit clearer what we'll need to add -- we can replace the plain view components with nested tabs - we'll start with music:

```tsx
function MusicTabs() {
  return (
    <Navigator>
      <Tabbar>
        <TextTab>playlists</TextTab>
        <TextTab>artists</TextTab>
        <TextTab>albums</TextTab>
      </Tabbar>

      <Tabs>
        <TabPanel>
          <Title>Playlists Feed</Title>
        </TabPanel>
        <TabPanel>
          <Title>Artists Feed</Title>
        </TabPanel>
        <TabPanel>
          <Title>Albums Feed</Title>
        </TabPanel>
      </Tabs>
    </Navigator>
  );
}
```

Our podcast component is going to look a lot like this one, so we can create a component to share our configurations if we'd like:

```tsx
function ContentTabs({ screens, children }) {
  return (
    <Navigator>
      <Tabbar>
        {screens.map(screen => (
          <TextTab key={screen}>{screen}</TextTab>
        ))}
      </Tabbar>

      <Tabs>{children}</Tabs>
    </Navigator>
  );
}

// refactor our previous tabs
function MusicTabs() {
  return (
    <ContentTabs screens={['playlists', 'artists', 'albums']}>
      <TabPanel>
        <Title>Playlists Feed</Title>
      </TabPanel>
      <TabPanel>
        <Title>Artists Feed</Title>
      </TabPanel>
      <TabPanel>
        <Title>Albums Feed</Title>
      </TabPanel>
    </ContentTabs>
  );
}

function PodcastTabs() {
  return (
    <ContentTabs screens={['episodes', 'downloads', 'shows']}>
      <TabPanel>
        <Title>Episodes Feed</Title>
      </TabPanel>
      <TabPanel>
        <Title>Downloads Feed</Title>
      </TabPanel>
      <TabPanel>
        <Title>Shows Feed</Title>
      </TabPanel>
    </ContentTabs>
  );
}

// replace the old panels with our new tabs
function SpotifyTabs() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Navigator>
        <Tabbar>
          <TextTab>music</TextTab>
          <TextTab>podcasts</TextTab>
        </Tabbar>

        <Tabs>
          <MusicTabs />
          <PodcastTabs />
        </Tabs>
      </Navigator>
    </SafeAreaView>
  );
}
```

Now we're able to swipe between tabs, and even swipe between music and podcasts.

## Adding focus states

The last thing we'll add here is displaying an active state in our tabs with opacity:

```tsx
import { useInterpolation, Extrapolate } from 'navigation-components';
import Animated from 'react-native-reanimated';

// this component will hook into the active state of the parent navigator
function ActiveOpacity({ index, children }: iActiveOpacity) {
  const styles = useInterpolation({
    opacity: {
      inputRange: [-1, 0, 1],
      outputRange: [0.5, 1, 0.5],
      extrapolate: Extrapolate.CLAMP,
    },
  });

  return <Animated.View style={styles}>{children}</Animated.View>;
}

// update our TextTab component to reflect the navigators active state:
function TextTab({ children }) {
  return (
    <ActiveOpacity>
      <Text style={styles.tab}>{children}</Text>
    </ActiveOpacity>
  );
}
```

That's it! Now we have a cool little navigation UI that lets us tap and swipe between different sets of tabs.
