import React from 'react';
import { Navigator, useNavigator } from '../src';
import { Text } from 'react-native';
import { render } from './test-utils';

function NavigatorListener({ listener }: any) {
  const navigator = useNavigator();

  return listener(navigator);
}

test('render()', () => {
  const listener = jest.fn(() => null);

  const { debug } = render(
    <Navigator routes={['uno', 'dos']}>
      <Text>1</Text>
      <Text>2</Text>
      <NavigatorListener listener={listener} />
    </Navigator>
  );

  debug();
  expect(listener).toHaveBeenCalled();
});
