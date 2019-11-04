import React from 'react';
import {
  render,
  prettyPrint,
  getQueriesForElement,
  getAllByLabelText,
  act,
} from '@testing-library/react-native';
import format from 'pretty-format';
import { History, navigate as globalNavigate, iHistoryProvider } from '../src';

function customRender(ui: any, options?: Partial<iHistoryProvider>) {
  const utils = render(<History {...options}>{ui}</History>);

  function getFocused() {
    const focusedScreen = findFocused(utils.container);
    return {
      container: focusedScreen,
      ...getQueriesForElement(focusedScreen),
      debug: function() {
        return customDebug(focusedScreen);
      },
    };
  }

  function findFocused(parent: any): any {
    const focusedScreens = getAllByLabelText(parent, 'screen', {
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

  function debug(element = utils.baseElement) {
    return customDebug(element);
  }

  return {
    ...utils,
    debug: debug,
    getFocused,
  };
}

// to be removed when rtl updates w/ debug config:
function customDebug(element: any) {
  return console.log(
    // @ts-ignore
    prettyPrint(element, undefined, { plugins: defaultPlugins })
  );
}

const { ReactElement, ReactTestComponent } = format.plugins;

function createFormatter(propsToRemove: string[]) {
  const plugin = {
    test(val: any) {
      return val.props !== undefined;
    },
    serialize(
      element: any,
      config: any,
      indentation: any,
      depth: any,
      refs: any,
      printer: any
    ) {
      Object.keys(element.props).map(prop => {
        if (propsToRemove.includes(prop)) {
          delete element.props[prop];
        }
      });

      if (ReactTestComponent.test(element)) {
        return ReactTestComponent.serialize(
          element,
          config,
          indentation,
          depth,
          refs,
          printer
        );
      }

      return ReactElement.serialize(
        element,
        config,
        indentation,
        depth,
        refs,
        printer
      );
    },
  };

  return plugin;
}

const removeStyleProp = createFormatter([
  'style',
  'pointerEvents',
  'collapsable',
  'activeOpacity',
]);

const defaultPlugins = [removeStyleProp, ReactTestComponent, ReactElement];

// re-export everything
export * from '@testing-library/react-native';

function navigate(to: string) {
  act(() => {
    globalNavigate(to);
  });
}

// override render method
export { customRender as render, navigate };
