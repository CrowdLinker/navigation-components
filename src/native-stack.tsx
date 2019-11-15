import React from 'react';
import {
  // @ts-ignore
  ScreenStack,
  // @ts-ignore
  ScreenStackHeaderConfig,
  // @ts-ignore
  ScreenStackHeaderLeftView,
  // @ts-ignore
  ScreenStackHeaderCenterView,
  // @ts-ignore
  ScreenStackHeaderRightView,
  // @ts-ignore
  ScreenStackHeaderTitleView,
  Screen,
} from 'react-native-screens';
import { StyleSheet, ViewStyle } from 'react-native';
import { useStack } from './hooks';
import { usePager } from './pager';
import { createRoute } from './create-route';

interface iNativeStack {
  children: React.ReactNode[];
  screenConfig?: Partial<iScreenConfig>;
  headers?: iHeader[];
  style?: ViewStyle;
}

interface iScreenConfig {
  onDismissed: () => void;
  stackAnimation: 'default' | 'fade' | 'none';
  stackPresentation: 'push' | 'modal' | 'transparentModal';
}

function NativeStack({ children, screenConfig = {}, style }: iNativeStack) {
  const [activeIndex] = usePager();

  const { pop } = useStack();

  return (
    <ScreenStack style={style || { flex: 1 }}>
      {React.Children.map(children, (child: any, index: number) => {
        const route = createRoute(child, index);

        if (index > activeIndex) {
          return null;
        }

        return (
          <Screen
            onDismissed={() => pop(1)}
            style={StyleSheet.absoluteFill}
            {...(screenConfig as any)}
          >
            {route}
          </Screen>
        );
      })}
    </ScreenStack>
  );
}

interface iHeader {
  hidden: boolean;
  color: string;
  title: string;
  titleFontFamily: string;
  titleFontSize: string;
  titleColor: string;
  backgroundColor: string;
  hideShadow: boolean;
  hideBackButton: boolean;
  gestureEnabled: boolean;
  translucent: boolean;
  backTitle: string;
  backTitleFontFamily: string;
  backTitleFontSize: string;
  children: React.ReactNode;
}

function Header(props: Partial<iHeader>) {
  return <ScreenStackHeaderConfig {...props} />;
}

Header.Left = function({ children }: { children: React.ReactNode }) {
  return <ScreenStackHeaderLeftView>{children}</ScreenStackHeaderLeftView>;
};

Header.Center = function({ children }: { children: React.ReactNode }) {
  return <ScreenStackHeaderCenterView>{children}</ScreenStackHeaderCenterView>;
};

Header.Right = function({ children }: { children: React.ReactNode }) {
  return <ScreenStackHeaderRightView>{children}</ScreenStackHeaderRightView>;
};

Header.Title = function({ children }: { children: React.ReactNode }) {
  return <ScreenStackHeaderTitleView>{children}</ScreenStackHeaderTitleView>;
};

export { NativeStack, Header };
