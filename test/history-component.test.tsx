import React from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import {
  history,
  History,
  useLocation,
  createHistory,
  navigate,
  useHistory,
} from '../src';

function Location() {
  const location = useLocation();
  return <Text>{location}</Text>;
}

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

test.todo('history parses out url scheme prop for deep linking');
test.todo('history fires back() action on android back press');
