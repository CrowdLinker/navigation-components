import React from 'react';
import {
  render,
  getQueriesForElement,
  getAllByLabelText,
  act,
} from '@testing-library/react-native';
import { History, navigate as globalNavigate, iHistoryProvider } from '../src';

function customRender(ui: any, options?: Partial<iHistoryProvider>) {
  const utils = render(<History {...options}>{ui}</History>, {
    options: {
      debug: { omitProps: ['zstyle', 'activeOpacity'] },
    },
  });

  function getFocused() {
    const focusedScreen = findFocused(utils.container);
    return {
      container: focusedScreen,
      ...getQueriesForElement(focusedScreen),
      debug: function() {
        return utils.debug(focusedScreen);
      },
    };
  }

  function findFocused(parent: any): any {
    const focusedScreens = getAllByLabelText(parent, 'rnl-screen', {
      // @ts-ignore
      filter: ({ props }) => props.accessibilityStates.includes('selected'),
    });

    if (focusedScreens.length > 1) {
      if (parent === focusedScreens[0]) {
        if (focusedScreens[1]) {
          return findFocused(focusedScreens[1]);
        }
      }

      return findFocused(focusedScreens[0]);
    }

    return focusedScreens[0];
  }

  return {
    ...utils,
    getFocused,
  };
}

// re-export everything
export * from '@testing-library/react-native';

function navigate(to: string) {
  act(() => {
    globalNavigate(to);
  });
}

// override render method
export { customRender as render, navigate };
