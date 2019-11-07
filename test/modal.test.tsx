import React from 'react';
import { Text, Button } from 'react-native';
import { render } from './test-utils';
import { Navigator, Modal, useModal } from '../src';
import { fireEvent } from '@testing-library/react-native';

test('show() and dismiss toggle modal visibility', () => {
  function ShowModal() {
    const { show } = useModal();
    return <Button title="Show" onPress={() => show()} />;
  }

  function HideModal() {
    const { hide } = useModal();
    return <Button title="Hide" onPress={() => hide()} />;
  }

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
  function ShowModal() {
    const { show } = useModal();
    return <Button title="Show" onPress={() => show()} />;
  }

  function HideModal() {
    const { hide } = useModal();
    return <Button title="Hide" onPress={() => hide()} />;
  }

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
