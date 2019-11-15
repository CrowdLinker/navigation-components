import React from 'react';
import { View, ViewProps } from 'react-native';
import { useFocus } from './pager';

interface iAccessibleScreen extends ViewProps {
  children: React.ReactNode;
}

function AccessibleScreen({ children, ...rest }: iAccessibleScreen) {
  const focused = useFocus();

  const focusDepth = React.useContext(FocusDepthContext);
  const parentUnfocused = React.useContext(UnfocusedContext);

  let depth = focusDepth;

  if (parentUnfocused || !focused) {
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

const FocusDepthContext = React.createContext(1);
const UnfocusedContext = React.createContext(false);

function FocusDepthProvider({ children, depth, focused }: any) {
  return (
    <FocusDepthContext.Provider value={depth}>
      <UnfocusedContext.Provider value={!focused}>
        {children}
      </UnfocusedContext.Provider>
    </FocusDepthContext.Provider>
  );
}

export { AccessibleScreen };
