import React from 'react';
import {Library} from './library';
import {View, Text, StyleSheet} from 'react-native';
import {Modal, useModal, Navigator} from 'react-navigation-library';
import {Slide, styles} from '../shared';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SafeAreaView from 'react-native-safe-area-view';

function SpotifyApp() {
  return (
    // <SafeAreaView style={{flex: 1}}>
    <Navigator>
      <Modal>
        <View style={{flex: 1}}>
          <Library />
          <PlayerPreview title="This is the title" />
        </View>
        <Player />
      </Modal>
    </Navigator>
    // </SafeAreaView>
  );
}

function PlayerPreview({title}: {title: string}) {
  const modal = useModal();

  return (
    <TouchableOpacity
      onPress={() => modal.show({title})}
      style={{
        height: 60,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: StyleSheet.hairlineWidth,
      }}>
      <Text style={styles.subheader}>{title}</Text>
    </TouchableOpacity>
  );
}

function Player({}) {
  const modal = useModal();
  const title = modal.state ? modal.state.title : '';

  return (
    <Slide index={4}>
      <View style={{marginTop: 100}} />
      <Text style={styles.header}>{`Now playing:\n${title}`}</Text>
    </Slide>
  );
}

export {SpotifyApp};
