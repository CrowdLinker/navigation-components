import React from 'react';
import { View, ViewProps } from 'react-native';
import { useFocus } from '@crowdlinker/react-native-pager';

interface iAccessibleScreen extends ViewProps {
  children: React.ReactNode;
}

function AccessibleScreen({ children, ...rest }: iAccessibleScreen) {
  const focused = useFocus();

  return (
    <View
      style={{ flex: 1 }}
      accessibilityRole="tab"
      accessibilityStates={[focused ? 'selected' : 'disabled']}
      accessibilityLabel="screen"
      {...rest}
    >
      {children}
    </View>
  );
}

export { AccessibleScreen };
