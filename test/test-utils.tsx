import React from 'react';
import {
  render,
  getQueriesForElement,
  act,
  RenderOptions,
  NativeTestInstance,
  queryAllByTestId,
  fireEvent,
} from '@testing-library/react-native';

import {
  History,
  history as globalHistory,
  iHistoryProvider,
  Link,
  createHistory,
} from '../src';
import { Linking, BackHandler } from 'react-native';

interface RenderHistoryProps extends iHistoryProvider {
  noWrap?: boolean;
}
export interface NavigatorRenderOptions extends RenderOptions {
  historyProps?: Partial<RenderHistoryProps>;
}

const defaultProps: NavigatorRenderOptions = {
  options: {},
  historyProps: {},
};

const defaults = {
  omitProps: [
    'style',
    'activeOpacity',
    'activeOffsetX',
    'pointerEvents',
    'collapsable',
    'underlineColorAndroid',
    'rejectResponderTermination',
    'allowFontScaling',
  ],
};

function EmptyWrapper({ children }: any) {
  return children;
}

function renderWithHistory(
  ui: any,
  args: NavigatorRenderOptions = defaultProps
) {
  const { options, historyProps = {}, ...rest } = args;

  const { history = createHistory(), noWrap, ...props } = historyProps;
  const Wrapper = noWrap ? EmptyWrapper : History;

  const utils = render(
    ui,

    {
      wrapper: Wrapper as any,
      options: {
        debug: {
          omitProps: defaults.omitProps,
          ...(options && options.debug ? options.debug : {}),
        },
      },
      ...rest,
    }
  );

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

  function navigate(to: string) {
    _navigate(to, history);
  }

  return {
    ...utils,
    getFocused,
    navigate,
  };
}

function findFocused(container: NativeTestInstance): NativeTestInstance {
  let screens = queryAllByTestId(container, /rnl-screen/i);

  let maxDepth = 0;
  let matchIndex = 0;

  // finds rnl-screen with the highest focus depth in the tree
  for (let i = 0; i < screens.length; i++) {
    const screen = screens[i];
    const depth = parseInt(screen.props.testID.replace(/^\D+/g, ''));

    if (depth >= maxDepth) {
      matchIndex = i;
      maxDepth = depth;
    }
  }

  return screens[matchIndex];
}

function _navigate(to: string, history = globalHistory) {
  act(() => {
    history.navigate(to);
  });
}

function cleanupHistory(history = globalHistory) {
  act(() => {
    history.reset();
  });
}

jest.mock('react-native/Libraries/Linking/Linking', () => {
  let callbacks: any[] = [];

  return {
    openLink: ({ url }: { url: string }) => callbacks.map(cb => cb({ url })),
    getInitialURL: jest.fn().mockResolvedValue(''),
    addEventListener: (_: string, cb: Function) => callbacks.push(cb),
    removeEventListener: (_: string, cb: Function) =>
      (callbacks = callbacks.filter(c => c !== cb)),
  };
});

jest.mock('BackHandler', () => {
  let callbacks: any[] = [];

  return {
    backPress: () => callbacks.map(cb => cb()),
    addEventListener: (_: string, cb: Function) => callbacks.push(cb),
    removeEventListener: (_: string, cb: Function) =>
      (callbacks = callbacks.filter(c => c !== cb)),
  };
});

function openLink(url: string) {
  act(() => {
    // @ts-ignore
    Linking.openLink({ url });
  });
}

function androidBackPress() {
  act(() => {
    // @ts-ignore
    BackHandler.backPress();
  });
}

const ntlFireEvent = {
  ...fireEvent,
  openLink,
  androidBackPress,
};

export * from '@testing-library/react-native';

export {
  renderWithHistory as render,
  _navigate as navigate,
  cleanupHistory as cleanup,
  defaults,
  findFocused,
  ntlFireEvent as fireEvent,
};
