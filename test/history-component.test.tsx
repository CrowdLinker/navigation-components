import React from 'react';
import { Text, Linking, BackHandler, Button } from 'react-native';
import { render, act, wait, fireEvent } from '@testing-library/react-native';
import {
  history,
  History,
  useLocation,
  createHistory,
  navigate,
  useHistory,
  BasepathProvider,
  useNavigate,
} from '../src';

function Location() {
  const location = useLocation();
  return <Text>{location}</Text>;
}

afterEach(() => {
  act(() => {
    history.reset();
  });
});

jest.mock('Linking', () => {
  let callbacks: any[] = [];

  return {
    change: ({ url }: { url: string }) => callbacks.map(cb => cb({ url })),
    getInitialURL: jest.fn().mockResolvedValue(''),
    addEventListener: (_: string, cb: Function) => callbacks.push(cb),
    removeEventListener: (_: string, cb: Function) =>
      (callbacks = callbacks.filter(c => c !== cb)),
  };
});

jest.mock('BackHandler', () => {
  let callbacks: any[] = [];

  return {
    press: () => callbacks.map(cb => cb()),
    addEventListener: (_: string, cb: Function) => callbacks.push(cb),
    removeEventListener: (_: string, cb: Function) =>
      (callbacks = callbacks.filter(c => c !== cb)),
  };
});

test('history takes an initial path', () => {
  const spy = jest.spyOn(history, 'init');

  const { getByText } = render(
    <History initialPath="/123">
      <Location />
    </History>
  );

  expect(spy).toHaveBeenCalled();
  getByText('/123');
});

test('history works with a custom history prop', () => {
  const myHistory = createHistory();

  const spy = jest.spyOn(myHistory, 'init');

  const { getByText } = render(
    <History initialPath="/345" history={myHistory}>
      <Location />
    </History>
  );

  expect(spy).toHaveBeenCalled();
  getByText('/345');
});

test('nested <History /> do nothing', () => {
  const { getByText } = render(
    <History initialPath="/123">
      <History initialPath="/567">
        <Location />
      </History>
    </History>
  );

  getByText('/123');
});

test('history onChange prop works', () => {
  const onChange = jest.fn();
  render(
    <History onChange={onChange}>
      <Location />
    </History>
  );

  act(() => {
    navigate('/123');
  });

  expect(onChange).toHaveBeenCalledWith('/123');
});

test('useHistory() gets active history', () => {
  const spy = jest.fn().mockImplementation(() => null);
  function Consumer() {
    const history = useHistory();
    return spy(history);
  }

  render(
    <History>
      <Consumer />
    </History>
  );

  expect(spy).toHaveBeenCalled();
  expect(spy).toHaveBeenCalledWith(history);
});

test('useHistory() throws if no history is available', () => {
  function Consumer() {
    useHistory();
    return null;
  }

  jest.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => render(<Consumer />)).toThrow();

  // @ts-ignore
  console.error.mockRestore();
});

test('useNavigate() works', () => {
  function Consumer() {
    const navigate = useNavigate();
    return (
      <>
        <Button title="navigate" onPress={() => navigate('test')} />;
        <Location />
      </>
    );
  }

  const { getByText } = render(
    <History>
      <BasepathProvider value="/deep/nested/link">
        <Consumer />
      </BasepathProvider>
    </History>
  );

  fireEvent.press(getByText('navigate'));

  getByText('/deep/nested/link/test');
});

test('useNavigate() works with root path', () => {
  function Consumer() {
    const navigate = useNavigate();
    return (
      <>
        <Button title="navigate" onPress={() => navigate('test')} />;
        <Location />
      </>
    );
  }

  const { getByText } = render(
    <History>
      <Consumer />
    </History>
  );

  fireEvent.press(getByText('navigate'));

  getByText('/test');
});

test('useNavigate() works with relative paths', () => {
  function Consumer() {
    const navigate = useNavigate();
    return (
      <>
        <Button title="navigate" onPress={() => navigate('../test')} />;
        <Location />
      </>
    );
  }

  const { getByText } = render(
    <History>
      <BasepathProvider value="/deep/nested/link">
        <Consumer />
      </BasepathProvider>
    </History>
  );

  fireEvent.press(getByText('navigate'));

  getByText('/deep/nested/test');
});

test('history responds to initial URL', async () => {
  const initialURL = 'app://test/123';

  jest
    .spyOn(Linking, 'getInitialURL')
    .mockImplementationOnce(() => Promise.resolve(initialURL));

  const { getByText } = render(
    <History scheme="app://test">
      <Location />
    </History>
  );

  await wait(() => getByText('/123'));
});

test('history does not respond to empty link', async () => {
  const initialURL = 'app://test';

  jest
    .spyOn(Linking, 'getInitialURL')
    .mockImplementationOnce(() => Promise.resolve(initialURL));

  const spy = jest.spyOn(history, 'navigate');

  render(
    <History scheme="app://test">
      <Location />
    </History>
  );

  await wait(() => {}, { timeout: 300 });
  expect(spy).not.toHaveBeenCalled();
});

test('history parses out url scheme prop for deep linking', () => {
  const { getByText } = render(
    <History scheme="test://app">
      <Location />
    </History>
  );

  act(() => {
    // @ts-ignore
    Linking.change({ url: 'test://app/one/two' });
  });

  getByText('/one/two');

  // empty link does nothing
  act(() => {
    // @ts-ignore
    Linking.change({ url: '' });
  });

  getByText('/one/two');

  // root path link does nothing
  act(() => {
    // @ts-ignore
    Linking.change({ url: 'test://app' });
  });

  getByText('/one/two');
});

test('history fires back() action on android back press', () => {
  // @ts-ignore
  jest.spyOn(BackHandler, 'press');

  const { getByText } = render(
    <History scheme="test://app">
      <Location />
    </History>
  );

  act(() => {
    navigate('/one');
    navigate('/two');
  });

  getByText('/two');

  act(() => {
    // @ts-ignore
    BackHandler.press();
  });

  getByText('/one');

  act(() => {
    // @ts-ignore
    BackHandler.press();
    // @ts-ignore
    BackHandler.press();
    // @ts-ignore
    BackHandler.press();
  });

  getByText('/');
});
