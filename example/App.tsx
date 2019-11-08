import React from 'react';
import {SpotifyApp} from './src/spotify';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {useScreens} from 'react-native-screens';
import {History, Pager} from 'react-navigation-library';
import {Slide} from './src/shared';

useScreens();

function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{flex: 1}}>
        <History initialPath="/main/music/artists" scheme="example://app">
          <SpotifyApp />
        </History>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function P() {
  return (
    <Pager>
      <Slide index={0} />
      <Slide index={1} />
      <Slide index={2} />
    </Pager>
  );
}
export default App;
