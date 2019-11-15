import React from 'react';
import { IndexProvider, FocusProvider } from './pager';
import { BasepathProvider } from './history-component';
import { AccessibleScreen } from './accessible-screen';
import { useNavigator } from './navigator';

function createRoute(child: any, index: number) {
  const navigator = useNavigator();

  const route = navigator.routes[index];
  const focused = navigator.activeIndex === index;

  if (route !== undefined) {
    return (
      <BasepathProvider value={route}>
        <IndexProvider index={index}>
          <FocusProvider focused={focused}>
            <AccessibleScreen routeFocused={navigator.focused}>
              {child}
            </AccessibleScreen>
          </FocusProvider>
        </IndexProvider>
      </BasepathProvider>
    );
  }

  return (
    <IndexProvider index={index}>
      <FocusProvider focused={focused}>
        <AccessibleScreen>{child}</AccessibleScreen>
      </FocusProvider>
    </IndexProvider>
  );
}

export { createRoute };
