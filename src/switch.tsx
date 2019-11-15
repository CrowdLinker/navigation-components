import React from 'react';
import { StyleSheet } from 'react-native';
import { ScreenContainer, Screen } from 'react-native-screens';
import { usePager } from './pager';

import { createRoute } from './create-route';

interface iSwitch {
  children: any;
}

function Switch({ children }: iSwitch) {
  const [activeIndex] = usePager();

  return (
    <ScreenContainer style={{ flex: 1 }}>
      {React.Children.map(children, (child: any, index: number) => {
        const route = createRoute(child, index);
        const active = activeIndex === index ? 1 : 0;

        return (
          <Screen active={active} style={StyleSheet.absoluteFill}>
            {route}
          </Screen>
        );
      })}
    </ScreenContainer>
  );
}

export { Switch };
