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
import { StyleSheet, View, Text } from 'react-native';
import { useNavigator } from './navigator';
import { BasepathProvider } from './history';
import { StackContext } from './stack';
import {
  usePager,
  // @ts-ignore
  FocusProvider,
  // @ts-ignore
  IndexProvider,
} from '@crowdlinker/react-native-pager';

interface iNativeStack {
  children: React.ReactNode[];
  screenConfig?: Partial<iScreenConfig>;
  headers?: iHeader[];
}

interface iScreenConfig {
  onDismissed: () => void;
  stackAnimation: 'default' | 'fade' | 'none';
  stackPresentation: 'push' | 'modal' | 'transparentModal';
}

function NativeStack({ children, screenConfig = {} }: iNativeStack) {
  const navigator = useNavigator();
  const [activeIndex, onChange] = usePager();

  function push(amount = 1) {
    const nextIndex = activeIndex + amount;
    if (navigator.routes.length > 0) {
      const nextRoute = navigator.routes[nextIndex];
      if (nextRoute) {
        navigator.navigate(nextRoute);
      }

      return;
    }

    onChange(nextIndex);
  }

  function pop(amount = 1) {
    const nextIndex = activeIndex - amount;

    if (navigator.routes.length > 0) {
      const nextRoute = navigator.routes[nextIndex];

      if (nextRoute) {
        navigator.navigate(nextRoute);
        return;
      }
    }

    onChange(nextIndex);
  }

  return (
    <StackContext.Provider value={{ push, pop }}>
      <ScreenStack style={{ flex: 1 }}>
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
                    <IndexProvider index={index}>{child}</IndexProvider>
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
                <IndexProvider index={index}>{child}</IndexProvider>
              </FocusProvider>
            </Screen>
          );
        })}
      </ScreenStack>
    </StackContext.Provider>
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
