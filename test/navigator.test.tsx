import React from 'react';
import {
  Navigator,
  useNavigator,
  Tabs,
  Link,
  useParams,
  history,
  Stack,
  NativeStack,
  Modal,
  Switch,
} from '../src';
import { Text, View } from 'react-native';
import { render, fireEvent, navigate } from './test-utils';

import '@testing-library/jest-native/extend-expect';

function NavigatorListener({ listener }: any) {
  const navigator = useNavigator();
  return listener(navigator);
}

function Params({ prop, children }: any) {
  const params = useParams<any>();
  return (
    <Text>
      {children} {params ? params[prop] : ''}
    </Text>
  );
}

afterEach(() => {
  history.reset();
});

test('render()', () => {
  const listener = jest.fn(() => null);

  navigate('/uno');

  const { getByText } = render(
    <Navigator routes={['uno', 'dos']}>
      <Tabs style={{ width: 100 }}>
        <Link to="dos">
          <Text>To dos</Text>
        </Link>
        <Link to="uno">
          <Text>To uno</Text>
        </Link>
      </Tabs>

      <NavigatorListener listener={listener} />
    </Navigator>
  );

  expect(listener).toHaveBeenCalled();

  expect(listener).toHaveBeenLastCalledWith(
    expect.objectContaining({ activeIndex: 0 })
  );

  fireEvent.press(getByText('To dos'));

  expect(listener).toHaveBeenLastCalledWith(
    expect.objectContaining({ activeIndex: 1 })
  );

  fireEvent.press(getByText('To uno'));

  expect(listener).toHaveBeenLastCalledWith(
    expect.objectContaining({ activeIndex: 0 })
  );
});

test('params', () => {
  const listener = jest.fn(() => null);

  navigate('/uno/1');

  const { getFocused } = render(
    <Navigator routes={['uno/:id', 'dos/:id']}>
      <Tabs style={{ width: 100 }}>
        <Link to="dos/2">
          <Text>To dos</Text>
          <Params prop="id">Uno params: </Params>
        </Link>
        <Link to="uno/3">
          <Text>To uno</Text>
          <Params prop="id">Dos params: </Params>
        </Link>
      </Tabs>

      <NavigatorListener listener={listener} />
    </Navigator>
  );

  getFocused().getByText(/uno params: 1/i);

  fireEvent.press(getFocused().getByText('To dos'));

  expect(listener).toHaveBeenLastCalledWith(
    expect.objectContaining({ activeIndex: 1 })
  );

  getFocused().getByText(/dos params: 2/i);

  fireEvent.press(getFocused().getByText('To uno'));

  getFocused().getByText(/uno params: 3/i);

  expect(listener).toHaveBeenLastCalledWith(
    expect.objectContaining({ activeIndex: 0 })
  );
});

test('nested', () => {
  function Inner() {
    return (
      <Navigator routes={['one', 'two']}>
        <Tabs style={{ width: 100 }}>
          <Text>One</Text>

          <View>
            <Text>Two</Text>
            <Link to="../../root">
              <Text>Back</Text>
            </Link>
          </View>
        </Tabs>
      </Navigator>
    );
  }

  function Outer({ children }: any) {
    return (
      <Navigator routes={['root', 'inner']}>
        <Tabs style={{ width: 100 }}>
          <View>
            <Text>root</Text>
            <Link to="inner/two">
              <Text>Link</Text>
            </Link>
          </View>
          {children}
        </Tabs>
      </Navigator>
    );
  }

  navigate('/root');

  const { getFocused } = render(
    <Outer>
      <Inner />
    </Outer>
  );

  fireEvent.press(getFocused().getByText('Link'));
  getFocused().getByText('Two');

  fireEvent.press(getFocused().getByText('Back'));
  getFocused().getByText('root');
});

test('root "/" is the default path', () => {
  navigate('/');

  const { getFocused } = render(
    <Navigator routes={['first', '/']}>
      <Tabs style={{ width: 100 }}>
        <Text>1</Text>
        <Text>2</Text>
      </Tabs>
    </Navigator>
  );

  getFocused().getByText('2');

  navigate('/first');

  getFocused().getByText('1');

  navigate('/');

  getFocused().getByText('2');
});

test('initialIndex defaults when there is no initial match', () => {
  navigate('/four');

  const { getFocused, getByText } = render(
    <Navigator routes={['one', 'two', 'three']} initialIndex={1}>
      <Tabs style={{ width: 1 }}>
        <Text>1</Text>
        <Text>2</Text>
        <Text>3</Text>
      </Tabs>
    </Navigator>
  );

  getFocused().getByText('2');
  expect(getByText('2')).toBeEnabled();
  expect(getByText('1')).toBeDisabled();
});

test('stack works', () => {
  navigate('/four');

  const { getFocused } = render(
    <Navigator routes={['one', 'two', 'three']} initialIndex={0}>
      <Stack style={{ width: 1 }}>
        <Text>1</Text>
        <Text>2</Text>
        <Text>3</Text>
      </Stack>
    </Navigator>
  );

  getFocused().getByText('1');
});

test('native-stack works', () => {
  navigate('/four');

  const { getFocused } = render(
    <Navigator routes={['one', 'two', 'three']} initialIndex={2}>
      <NativeStack>
        <Text>1</Text>
        <Text>2</Text>
        <Text>3</Text>
      </NativeStack>
    </Navigator>
  );

  getFocused().getByText('3');
});

test('switch works', () => {
  navigate('/four');

  const { getFocused } = render(
    <Navigator routes={['one', 'two', 'three']}>
      <Switch>
        <Text>1</Text>
        <Text>2</Text>
        <Text>3</Text>
      </Switch>
    </Navigator>
  );

  getFocused().getByText('1');
});

test('modal works', () => {
  navigate('/');
  const { getFocused } = render(
    <Navigator routes={['one', 'two']}>
      <Modal style={{ width: 1 }}>
        <Text>1</Text>
        <Text>2</Text>
      </Modal>
    </Navigator>
  );

  navigate('/two');

  getFocused().getByText('2');
  expect(getFocused().container).toHaveProp('accessibilityViewIsModal', true);
});
