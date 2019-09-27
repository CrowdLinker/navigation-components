import React from 'react';
import {SpotifyApp} from './src/spotify';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useScreens} from 'react-native-screens';
import {History} from '@crowdlinker/navigation';

useScreens();

function App() {
  return (
    <SafeAreaProvider>
      <History initialPath="/main/music/artists" scheme="example://app">
        <SpotifyApp />
      </History>
    </SafeAreaProvider>
  );
}

export default App;
