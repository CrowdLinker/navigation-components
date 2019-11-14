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
  History,
  createHistory,
  usePager,
} from '../src';
import { Text, View, Button } from 'react-native';
import { render, navigate } from './test-utils';
import { fireEvent, act } from '@testing-library/react-native';

import '@testing-library/jest-native/extend-expect';

afterEach(() => {
  act(() => {
    history.reset();
  });
});

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

test('render()', () => {
  const listener = jest.fn(() => null);

  const { getByText } = render(
    <Navigator routes={['uno', 'dos']}>
      <Tabs>
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
      <Tabs>
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
  history.reset();

  function Inner() {
    return (
      <Navigator routes={['one', 'two']}>
        <Tabs>
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
      <History>
        <Navigator routes={['root', 'inner']}>
          <Tabs>
            <View>
              <Text>root</Text>
              <Link to="inner/two">
                <Text>Link</Text>
              </Link>
            </View>
            {children}
          </Tabs>
        </Navigator>
      </History>
    );
  }

  navigate('/root');

  const { getFocused, debug, container } = render(
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
      <Tabs>
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

test('switch works without routes', () => {
  const { getFocused } = render(
    <Navigator initialIndex={2}>
      <Switch>
        <Text>1</Text>
        <Text>2</Text>
        <Text>3</Text>
      </Switch>
    </Navigator>
  );

  getFocused().getByText('3');
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

test('nested history does nothing', () => {
  const fakeHistory = createHistory();

  const listener = jest.fn();
  fakeHistory.listen(listener);

  const spy = jest.spyOn(history, 'navigate');

  const { getByText } = render(
    <History history={fakeHistory}>
      <Navigator>
        <Text>1</Text>
        <Link to="blah">
          <Text>test</Text>
        </Link>
      </Navigator>
    </History>
  );

  listener.mockReset();
  fireEvent.press(getByText('test'));

  expect(fakeHistory.location).toEqual('/');
  expect(listener).not.toHaveBeenCalled();

  expect(spy).toHaveBeenCalled();
  expect(history.location).toEqual('/blah');
});

test('handleOnGesture navigates', () => {
  function SimulatedGesture() {
    const [activeIndex, onChange] = usePager();

    return <Button title="first" onPress={() => onChange(activeIndex + 1)} />;
  }

  function Two() {
    const [, onChange] = usePager();

    return <Button title="next" onPress={() => onChange(2)} />;
  }

  function Three() {
    const [, onChange] = usePager();

    return <Button title="back" onPress={() => onChange(0)} />;
  }

  const { getByText, getFocused } = render(
    <Navigator routes={['/', 'two/:id', 'three']}>
      <Tabs>
        <SimulatedGesture />
        <Two />
        <Three />
      </Tabs>
    </Navigator>
  );

  fireEvent.press(getByText('first'));

  getFocused().getByText('next');

  fireEvent.press(getByText('next'));

  getFocused().getByText('back');

  fireEvent.press(getFocused().getByText('back'));

  getFocused().getByText('first');
});

test('back() works', () => {
  function BackButton({ amount }: any) {
    const navigator = useNavigator();
    return <Button title="back" onPress={() => navigator.back(amount)} />;
  }

  const { getFocused } = render(
    <Navigator routes={['/', 'two']}>
      <Tabs>
        <Text>1</Text>
        <BackButton amount={1} />
      </Tabs>
    </Navigator>
  );

  expect(() => getFocused().getByText('back')).toThrow();

  navigate('/two');

  fireEvent.press(getFocused().getByText('back'));

  getFocused().getByText('1');
});

test('onChange prop works', () => {
  const onChange = jest.fn();

  render(
    <Navigator onChange={onChange} routes={['one', 'two']}>
      <Text>1</Text>
    </Navigator>
  );

  onChange.mockReset();

  navigate('/two');

  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(1, 'two');
});

test('undefined onChange does nothing', () => {
  const onChange = jest.fn();

  function UndefinedPush() {
    const [_, onChange] = usePager();

    // @ts-ignore
    return <Button title="change" onPress={() => onChange(undefined)} />;
  }

  const { getByText } = render(
    <Navigator onChange={onChange} routes={['one', 'two']}>
      <UndefinedPush />
    </Navigator>
  );

  onChange.mockReset();

  fireEvent.press(getByText('change'));

  expect(onChange).not.toHaveBeenCalled();
});

test('useNavigator() throws when undefined', () => {
  function Consumer() {
    useNavigator();
    return null;
  }

  jest.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => render(<Consumer />)).toThrow();

  // @ts-ignore
  console.error.mockRestore();
});
