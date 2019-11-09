import React from 'react';
import { Navigator, Stack, useStack, history } from '../src';
import { render } from './test-utils';
import { Button, Text } from 'react-native';
import { fireEvent } from '@testing-library/react-native';

afterEach(() => {
  history.reset();
});

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

test('push() adds multiple screens to stack', () => {
  function PushView() {
    const stack = useStack();
    return <Button title="push" onPress={() => stack.push(2)} />;
  }

  const { getFocused } = render(
    <Navigator routes={['/', 'two', 'three']}>
      <Stack>
        <PushView />
        <Text>2</Text>
        <Text>3</Text>
      </Stack>
    </Navigator>
  );

  fireEvent.press(getFocused().getByText('push'));
  getFocused().getByText('3');
});

test('push() works without routes[]', () => {
  function PushView() {
    const stack = useStack();
    return <Button title="push" onPress={() => stack.push()} />;
  }

  const { getFocused } = render(
    <Navigator>
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

test('pop() removes multiple screens from stack', () => {
  function PopView() {
    const stack = useStack();
    return <Button title="pop" onPress={() => stack.pop(2)} />;
  }

  const { getFocused } = render(
    <Navigator routes={['1', '2', '/']}>
      <Stack>
        <Text>1</Text>
        <Text>2</Text>
        <PopView />
      </Stack>
    </Navigator>
  );

  getFocused().getByText('pop');
  fireEvent.press(getFocused().getByText('pop'));

  getFocused().getByText('1');
});

test('pop() works without routes[]', () => {
  function PopView() {
    const stack = useStack();
    return <Button title="pop" onPress={() => stack.pop()} />;
  }

  const { getFocused } = render(
    <Navigator initialIndex={1}>
      <Stack>
        <Text>1</Text>
        <PopView />
      </Stack>
    </Navigator>
  );

  const pop = getFocused().getByText('pop');
  fireEvent.press(pop);

  getFocused().getByText('1');
});
