import React from 'react';
import {
  render,
  getQueriesForElement,
  getAllByLabelText,
  act,
} from '@testing-library/react-native';
import { History, history, navigate as globalNavigate } from '../dist/index';

function customRender(ui, options = {}) {
  const utils = render(<History>{ui}</History>, {
    // @ts-ignore
    options: {
      // @ts-ignore
      debug: { omitProps: ['style', 'activeOpacity'] },
    },
    ...options,
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

function navigate(to) {
  act(() => {
    globalNavigate(to);
  });
}

function cleanup() {
  history.reset();
}

// override render method
export { customRender as render, navigate, cleanup };
