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
  screensEnabled,
} from 'react-native-screens';
import { StyleSheet, ViewStyle } from 'react-native';
import { useNavigator } from './navigator';
import { BasepathProvider } from './history-component';
import { useStack } from './stack';
import {
  usePager,
  // @ts-ignore
  FocusProvider,
  // @ts-ignore
  IndexProvider,
  useFocus,
} from './pager';
import { AccessibleScreen } from './accessible-screen';

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
  const navigator = useNavigator();
  const [activeIndex, onChange] = usePager();

  const { pop } = useStack();

  return (
    <ScreenStack style={style || { flex: 1 }}>
      {React.Children.map(children, (child: any, index: number) => {
        if (index > activeIndex) {
          return null;
        }

        const route = navigator.routes[index];

        if (route) {
          return (
            <Screen
              onDismissed={() => pop(1)}
              style={StyleSheet.absoluteFill}
              {...(screenConfig as any)}
            >
              <BasepathProvider value={route}>
                <FocusProvider focused={index === activeIndex}>
                  <IndexProvider index={index}>
                    <AccessibleScreen>{child}</AccessibleScreen>
                  </IndexProvider>
                </FocusProvider>
              </BasepathProvider>
            </Screen>
          );
        }

        return (
          <Screen
            onDismissed={() => pop(1)}
            style={StyleSheet.absoluteFill}
            {...(screenConfig as any)}
          >
            <FocusProvider focused={index === activeIndex}>
              <IndexProvider index={index}>
                <AccessibleScreen>{child}</AccessibleScreen>
              </IndexProvider>
            </FocusProvider>
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
