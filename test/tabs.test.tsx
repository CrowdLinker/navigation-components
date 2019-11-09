import React from 'react';
import { Text } from 'react-native';
import { render } from './test-utils';
import { Navigator, Tabs, Tabbar, Tab, history } from '../src';
import { fireEvent } from '@testing-library/react-native';

test('tabbar maps links via index', () => {
  const { getByText, getFocused } = render(
    <Navigator>
      <Tabs>
        <Text>First</Text>
        <Text>Second</Text>
      </Tabs>

      <Tabbar>
        <Tab>
          <Text>1</Text>
        </Tab>

        <Tab>
          <Text>2</Text>
        </Tab>
      </Tabbar>
    </Navigator>
  );

  fireEvent.press(getByText('2'));
  getFocused().getByText('Second');

  fireEvent.press(getByText('1'));
  getFocused().getByText('First');
});

test('tabbar navigates to mapped route', () => {
  const spy = jest.spyOn(history, 'navigate');

  const { getByText, getFocused } = render(
    <Navigator routes={['one', 'two']}>
      <Tabs>
        <Text>First</Text>
        <Text>Second</Text>
      </Tabs>

      <Tabbar>
        <Tab>
          <Text>1</Text>
        </Tab>

        <Tab>
          <Text>2</Text>
        </Tab>
      </Tabbar>
    </Navigator>
  );

  fireEvent.press(getByText('2'));

  // empty  basepath
  expect(spy).toHaveBeenCalledWith('two', '');
  getFocused().getByText('Second');

  fireEvent.press(getByText('1'));

  // empty  basepath
  expect(spy).toHaveBeenCalledWith('one', '');
  getFocused().getByText('First');
});

test('tab can take a parent onPress prop', () => {
  const spy = jest.fn();

  const { getByText, getFocused } = render(
    <Navigator routes={['one', 'two']}>
      <Tabs>
        <Text>First</Text>
        <Text>Second</Text>
      </Tabs>

      <Tabbar>
        <Tab onPress={spy}>
          <Text>1</Text>
        </Tab>

        <Tab onPress={spy}>
          <Text>2</Text>
        </Tab>
      </Tabbar>
    </Navigator>
  );

  fireEvent.press(getByText('2'));
  getFocused().getByText('Second');
  expect(spy).toHaveBeenCalledTimes(1);

  fireEvent.press(getByText('1'));
  getFocused().getByText('First');
  expect(spy).toHaveBeenCalledTimes(2);
});
