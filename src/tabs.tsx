import React from 'react';
import {
  View,
  TouchableOpacity,
  TouchableOpacityProps,
  GestureResponderEvent,
  ViewProps,
} from 'react-native';
import { useNavigator } from './navigator';
import { BasepathProvider } from './history-component';
import {
  Pager,
  iPager,
  usePager,
  IndexProvider,
  useIndex,
  FocusProvider,
} from './pager';
import { AccessibleScreen } from './accessible-screen';

const MINIMUM_SWIPE_DISTANCE = 20;

interface iTabs extends iPager {
  children: React.ReactNode[];
}

function Tabs({ children, ...rest }: iTabs) {
  const [activeIndex] = usePager();
  const navigator = useNavigator();

  const lastIndex = React.Children.count(children) - 1;

  // this isn't perfect but will allow a parent pan responder to attach to swipe events
  // if its at the first or last index
  const activeOffsetX =
    activeIndex <= 0
      ? [-5, MINIMUM_SWIPE_DISTANCE]
      : activeIndex === lastIndex
      ? [-MINIMUM_SWIPE_DISTANCE, 5]
      : [-5, 5];

  return (
    <Pager
      style={{ flex: 1, overflow: 'hidden' }}
      panProps={{ activeOffsetX }}
      {...rest}
    >
      {React.Children.map(children, (child: any, index: number) => {
        const route = navigator.routes[index];

        if (route) {
          return (
            <BasepathProvider value={route}>
              <AccessibleScreen>{child}</AccessibleScreen>
            </BasepathProvider>
          );
        }

        return <AccessibleScreen>{child}</AccessibleScreen>;
      })}
    </Pager>
  );
}

interface iTabbar extends ViewProps {
  children: React.ReactNode;
}

function Tabbar({ children, style, ...rest }: iTabbar) {
  const [activeIndex] = usePager();

  return (
    <View style={[{ flexDirection: 'row' }, style]} {...rest}>
      {React.Children.map(children, (child: any, index: number) => {
        const focused = activeIndex === index;

        return (
          <IndexProvider index={index}>
            <FocusProvider focused={focused}>{child}</FocusProvider>
          </IndexProvider>
        );
      })}
    </View>
  );
}

interface iTab extends TouchableOpacityProps {
  children: React.ReactNode;
}

interface iTabContext {
  goTo: (index: number) => void;
}

function useTabs(): iTabContext {
  const [_, onChange] = usePager();
  const navigator = useNavigator();

  function goTo(index: number) {
    const route = navigator.routes[index];

    if (route) {
      navigator.navigate(route);
      return;
    }

    onChange(index);
  }

  return {
    goTo,
  };
}

function Tab({ children, onPress, ...rest }: iTab) {
  const index = useIndex();
  const tabs = useTabs();

  function handlePress(event: GestureResponderEvent) {
    onPress && onPress(event);
    tabs.goTo(index);
  }

  return (
    <TouchableOpacity accessibilityRole="link" {...rest} onPress={handlePress}>
      {children}
    </TouchableOpacity>
  );
}

export { Tabs, Tabbar, Tab, useTabs };
