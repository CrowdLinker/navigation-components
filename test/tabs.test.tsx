import React from 'react';
import { Text } from 'react-native';
import { render } from './test-utils';
import { Navigator, Tabs, Tabbar } from '../src';
import { fireEvent } from '@testing-library/react-native';

test('tabbar maps links via index', () => {
  const { getByText, getFocused } = render(
    <Navigator>
      <Tabs>
        <Text>First</Text>
        <Text>Second</Text>
      </Tabs>

      <Tabbar>
        <Text>1</Text>
        <Text>2</Text>
      </Tabbar>
    </Navigator>
  );

  fireEvent.press(getByText('2'));
  getFocused().getByText('Second');

  fireEvent.press(getByText('1'));
  getFocused().getByText('First');
});
