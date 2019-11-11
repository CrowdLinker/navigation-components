import React from 'react';
import { Text, Button } from 'react-native';
import { render } from './test-utils';
import { Navigator, Modal, useModal, history } from '../src';
import { fireEvent } from '@testing-library/react-native';

test('show() and dismiss toggle modal visibility', () => {
  const { getFocused } = render(
    <Navigator>
      <Modal>
        <ShowModal />
        <HideModal />
      </Modal>
    </Navigator>
  );

  fireEvent.press(getFocused().getByText('Show'));
  getFocused().getByText('Hide');

  fireEvent.press(getFocused().getByText('Hide'));
  getFocused().getByText('Show');
});

test('modalIndex works', () => {
  const { getFocused } = render(
    <Navigator initialIndex={1}>
      <Modal modalIndex={0}>
        <HideModal />
        <ShowModal />
      </Modal>
    </Navigator>
  );

  getFocused().getByText('Show');
  fireEvent.press(getFocused().getByText('Show'));

  getFocused().getByText('Hide');
});

test('active prop can trigger modal', () => {
  const { getFocused, rerender } = render(
    <Navigator>
      <Modal active={false}>
        <Text>Not modal</Text>
        <Text>Modal</Text>
      </Modal>
    </Navigator>
  );

  getFocused().getByText('Not modal');

  rerender(
    <Navigator>
      <Modal active>
        <Text>Not modal</Text>
        <Text>Modal</Text>
      </Modal>
    </Navigator>
  );

  getFocused().getByText('Modal');
});

test('modal works with routes', () => {
  const spy = jest.spyOn(history, 'navigate');

  const { getFocused } = render(
    <Navigator routes={['/', 'modal']}>
      <Modal>
        <ShowModal />
        <HideModal />
      </Modal>
    </Navigator>
  );

  fireEvent.press(getFocused().getByText('Show'));

  expect(spy).toHaveBeenCalledWith('modal', expect.any(String));

  fireEvent.press(getFocused().getByText('Hide'));

  expect(spy).toHaveBeenCalledWith('/', expect.any(String));
});

test('toggle() works', () => {
  function Toggle({ title }: any) {
    const modal = useModal();
    return <Button title={title} onPress={() => modal.toggle()} />;
  }

  const { getFocused } = render(
    <Navigator routes={['/', 'modal']}>
      <Modal>
        <Toggle title="Show" />
        <Toggle title="Hide" />
      </Modal>
    </Navigator>
  );

  fireEvent.press(getFocused().getByText('Show'));
  fireEvent.press(getFocused().getByText('Hide'));
});

test('throws when there are more than two routes specified', () => {
  jest.spyOn(console, 'error').mockImplementationOnce(() => {});

  expect(() =>
    render(
      <Navigator routes={['/', 'modal', 'error']}>
        <Modal>
          <ShowModal />
          <HideModal />
        </Modal>
      </Navigator>
    )
  ).toThrow();
});

test('useModal() throws if no modal context exists', () => {
  function Consumer() {
    useModal();
    return null;
  }

  jest.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => render(<Consumer />)).toThrow();

  // @ts-ignore
  console.error.mockRestore();
});

function ShowModal() {
  const { show } = useModal();
  return <Button title="Show" onPress={() => show()} />;
}

function HideModal() {
  const { hide } = useModal();
  return <Button title="Hide" onPress={() => hide()} />;
}
