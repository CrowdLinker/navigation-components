import React from 'react';
import { View, ViewProps } from 'react-native';
import { useFocus } from './pager';

interface iAccessibleScreen extends ViewProps {
  children: React.ReactNode;
  routeFocused?: boolean;
}

function AccessibleScreen({
  children,
  routeFocused,
  ...rest
}: iAccessibleScreen) {
  const focused = useFocus(); // parent screen is focused
  const parentUnfocused = React.useContext(UnfocusedContext); // in an unfocused / disabled subtree

  const focusDepth = React.useContext(FocusDepthContext);
  let depth = focusDepth;

  const navigatorNotFocused = routeFocused !== undefined && !routeFocused;

  // one or all of the parents is unfocused
  if (parentUnfocused || !focused || navigatorNotFocused) {
    depth = 0;
  }

  return (
    <View
      style={{ flex: 1 }}
      accessibilityRole="tab"
      accessibilityStates={[focused ? 'selected' : 'disabled']}
      testID={`rnl-screen-${depth}`}
      {...rest}
    >
      <FocusDepthProvider depth={depth + 1} focused={focused}>
        {children}
      </FocusDepthProvider>
    </View>
  );
}

// these components are to properly locate the focused screen
// might be useful in other cases as well, for now its just for getFocused()

// start at 1 so these screens don't have to be wrapped in a provider
const FocusDepthContext = React.createContext(1);
const UnfocusedContext = React.createContext(false);

function FocusDepthProvider({ children, depth, focused }: any) {
  const unfocused = !focused;

  return (
    <FocusDepthContext.Provider value={depth}>
      <UnfocusedProvider unfocused={unfocused}>{children}</UnfocusedProvider>
    </FocusDepthContext.Provider>
  );
}

function UnfocusedProvider({ children, unfocused }: any) {
  const parentUnfocused = React.useContext(UnfocusedContext);

  return (
    <UnfocusedContext.Provider
      value={parentUnfocused ? parentUnfocused : unfocused}
    >
      {children}
    </UnfocusedContext.Provider>
  );
}

export { AccessibleScreen };
