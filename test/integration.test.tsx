import React from 'react';
import { render } from './test-utils';
import { fireEvent } from '@testing-library/react-native';
import { Navigator, Tabs, useLocation, Link, Stack } from '../src';
import { View, Text } from 'react-native';

test('render()', () => {
  const { getFocused, getByText } = render(<App />);

  fireEvent.press(getFocused().getByText(/go to settings/i));

  getByText('/settings');
  getFocused().getByText('Settings');

  fireEvent.press(getFocused().getByText(/go to one/i));

  getByText('/settings/one');
  getFocused().getByText('One');

  fireEvent.press(getFocused().getByText(/go to two/i));

  getByText('/settings/two');
  getFocused().getByText('Two');

  fireEvent.press(getFocused().getByText(/up one level/i));

  getFocused().getByText('Settings');
  getByText('/settings');

  fireEvent.press(getFocused().getByText(/go to app/i));

  getByText('/app');
  getFocused().getByText('App');
});

function App() {
  const routes = ['app', 'settings'];
  return (
    <>
      <Navigator routes={routes}>
        <Tabs>
          <View>
            <Text>App</Text>
            <Link to="../settings">
              <Text>Go to settings</Text>
            </Link>
          </View>

          <View>
            <Text>Settings</Text>
            <Link to="../app">
              <Text>Go to app</Text>
            </Link>

            <Link to="one">
              <Text>Go to one</Text>
            </Link>

            <Navigator routes={['one', 'two', 'three']}>
              <Stack>
                <>
                  <Text>One</Text>
                  <Link to="../two">
                    <Text>go to two</Text>
                  </Link>
                </>
                <>
                  <Text>Two</Text>
                  <Link to="../">
                    <Text>Go up one level</Text>
                  </Link>
                </>
                <Text>Three</Text>
              </Stack>
            </Navigator>
          </View>
        </Tabs>
      </Navigator>

      <Location />
    </>
  );
}

function Location() {
  const location = useLocation();
  return <Text testID="location">{location}</Text>;
}

export default App;
