import React from 'react';
import {
  Tabs,
  Navigator,
  Tabbar,
  Tab,
  useInterpolation,
  Extrapolate,
} from 'navigation-components';
import {StyleSheet, SafeAreaView, Text, View} from 'react-native';
import Animated from 'react-native-reanimated';

function SpotifyTabs() {
  return (
    <SafeAreaView style={{flex: 1}}>
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

function ContentTabs({screens, children}) {
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

function TextTab({children}) {
  return (
    <Tab style={{padding: 10}}>
      <ActiveOpacity>
        <Text style={styles.tab}>{children}</Text>
      </ActiveOpacity>
    </Tab>
  );
}

function Title({children}) {
  return <Text style={styles.title}>{children}</Text>;
}

function TabPanel({children}) {
  return <View style={styles.centered}>{children}</View>;
}

function ActiveOpacity({index, children}: iActiveOpacity) {
  const styles = useInterpolation({
    opacity: {
      inputRange: [-1, 0, 1],
      outputRange: [0.5, 1, 0.5],
      extrapolate: Extrapolate.CLAMP,
    },
  });

  return <Animated.View style={styles}>{children}</Animated.View>;
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

export {SpotifyTabs};
