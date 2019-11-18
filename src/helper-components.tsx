import React from 'react';
import { Navigator, iNavigator } from './navigator';
import { Stack, iStack } from './stack';
import { NativeStack, iNativeStack } from './native-stack';
import { Tabs, iTabs, Tabbar, Tab } from './tabs';
import { Modal, iModal } from './modal';
import { Switch } from './switch';

interface StackNavigatorProps extends iNavigator {
  stackProps: iStack;
  children: React.ReactNode[];
}

function StackNavigator(props: StackNavigatorProps) {
  const { stackProps, children, ...rest } = props;

  return (
    <Navigator {...rest}>
      <Stack {...stackProps}>{children}</Stack>
    </Navigator>
  );
}

interface TabNavigatorProps extends iNavigator {
  tabsProps: iTabs;
  children: React.ReactNode[];
}

function TabNavigator(props: TabNavigatorProps) {
  const { tabsProps, children, ...rest } = props;
  return (
    <Navigator {...rest}>
      <Tabs {...tabsProps}>{children}</Tabs>
    </Navigator>
  );
}

interface NativeStackNavigatorProps extends iNavigator {
  stackProps: iNativeStack;
  children: React.ReactNode[];
}

function NativeStackNavigator(props: NativeStackNavigatorProps) {
  const { stackProps, children, ...rest } = props;
  return (
    <Navigator {...rest}>
      <NativeStack {...stackProps}>{children}</NativeStack>
    </Navigator>
  );
}

interface ModalNavigatorProps extends iNavigator {
  modalProps: iModal;
  children: [React.ReactNode, React.ReactNode];
}

function ModalNavigator(props: ModalNavigatorProps) {
  const { modalProps, children, ...rest } = props;

  return (
    <Navigator {...rest}>
      <Modal {...modalProps}>{children}</Modal>
    </Navigator>
  );
}

interface SwitchNavigatorProps extends iNavigator {}

function SwitchNavigator(props: SwitchNavigatorProps) {
  const { children, ...rest } = props;
  return (
    <Navigator {...rest}>
      <Switch>{children}</Switch>
    </Navigator>
  );
}

export {
  StackNavigator,
  TabNavigator,
  NativeStackNavigator,
  ModalNavigator,
  SwitchNavigator,
};
