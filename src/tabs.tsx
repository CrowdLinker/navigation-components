import React from 'react';
import { View } from 'react-native';
import { useNavigator } from './navigator';
import { BasepathProvider } from './history';
import { Pager, iPager, usePager } from '@crowdlinker/react-native-pager';
import { TouchableOpacity } from 'react-native-gesture-handler';
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

function Tabbar({ children, style }: any) {
  const [, onChange] = usePager();

  return (
    <View style={style || { flexDirection: 'row' }}>
      {React.Children.map(children, (child: any, index: number) => {
        return (
          <TouchableOpacity
            style={child.props.style}
            onPress={() => onChange(index)}
          >
            {child}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export { Tabs, Tabbar };
