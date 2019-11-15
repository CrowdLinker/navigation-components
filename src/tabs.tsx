import React from 'react';
import {
  View,
  TouchableOpacity,
  TouchableOpacityProps,
  GestureResponderEvent,
  ViewProps,
} from 'react-native';
import { useTabs } from './hooks';
import {
  Pager,
  iPager,
  usePager,
  IndexProvider,
  useIndex,
  FocusProvider,
} from './pager';
import { createRoute } from './create-route';

const MINIMUM_SWIPE_DISTANCE = 20;

interface iTabs extends iPager {
  children: React.ReactNode[];
}

function Tabs({ children, ...rest }: iTabs) {
  const [activeIndex] = usePager();

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
        const route = createRoute(child, index);
        return route;
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

export { Tabs, Tabbar, Tab };
