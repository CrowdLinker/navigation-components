import React from 'react';
import { Navigator, Stack, useStack } from '../src';
import { render, navigate } from './test-utils';
import { Button, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';

test('push() adds screen to stack', () => {
  function PushView() {
    const stack = useStack();
    return <Button title="push" onPress={() => stack.push()} />;
  }

  const { getFocused, debug } = render(
    <Navigator routes={['/', 'two']}>
      <Stack>
        <PushView />
        <Text>2</Text>
      </Stack>
    </Navigator>
  );

  fireEvent.press(getFocused().getByText('push'));
  getFocused().getByText('2');
});

test('pop() removes screen from stack', () => {
  function PopView() {
    const stack = useStack();
    return <Button title="pop" onPress={() => stack.pop()} />;
  }

  const { getFocused } = render(
    <Navigator routes={['1', '/']}>
      <Stack>
        <Text>1</Text>
        <PopView />
      </Stack>
    </Navigator>
  );

  getFocused().getByText('pop');
  fireEvent.press(getFocused().getByText('pop'));

  getFocused().getByText('1');
});

test('useStack() throws error if not in a stack provider', () => {
  function Consumer() {
    useStack();
    return null;
  }

  jest.spyOn(console, 'error').mockImplementation(() => {});

  expect(() =>
    render(
      <Navigator>
        <Consumer />
      </Navigator>
    )
  ).toThrow();

  // @ts-ignore
  console.error.mockRestore();
});
