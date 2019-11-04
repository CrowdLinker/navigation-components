import React from 'react';
import { Pager, iPager, usePager } from './pager';
import { useNavigator } from './navigator';
import { BasepathProvider } from './history-component';
import { AccessibleScreen } from './accessible-screen';

interface iStack extends iPager {
  children: React.ReactNode[];
}

function Stack({ children, ...rest }: iStack) {
  const navigator = useNavigator();
  const [activeIndex, onChange] = usePager();

  const lastIndex = React.Children.count(children) - 1;

  // if nested in another pan, delegate pan events to parent container on the last screen
  const activeOffsetX = activeIndex === lastIndex ? [-20, 5] : [-5, 5];

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
      }

      return;
    }

    onChange(nextIndex);
  }

  return (
    <StackContext.Provider value={{ push, pop }}>
      <Pager
        style={{ flex: 1, overflow: 'hidden', borderWidth: 1 }}
        clamp={{ prev: 0.6 }}
        panProps={{
          enabled: activeIndex > 0,
          activeOffsetX,
        }}
        {...rest}
      >
        {React.Children.map(children, (child: any, index: number) => {
          const route = navigator.routes[index];

          if (route) {
            return (
              <BasepathProvider value={route}>
                <AccessibleScreen>{child}</AccessibleScreen>
              </BasepathProvider>
            );
          }

          return <AccessibleScreen>{child}</AccessibleScreen>;
        })}
      </Pager>
    </StackContext.Provider>
  );
}

const StackContext = React.createContext<undefined | iStackContext>(undefined);

interface iStackContext {
  push: (amount: number) => void;
  pop: (amount: number) => void;
}

function useStack(): iStackContext {
  const stack = React.useContext(StackContext);

  if (!stack) {
    throw new Error(`useStack() must be used within a <Stack />`);
  }

  return stack;
}

export { Stack, useStack, StackContext };
