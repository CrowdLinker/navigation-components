import React from 'react';
import { Pager, iPager, usePager } from './pager';
import { useNavigator } from './navigator';
import { BasepathProvider } from './history-component';
import { AccessibleScreen } from './accessible-screen';

interface iStack extends iPager {
  children: React.ReactNode[];
  unmountOnExit: boolean;
}

function Stack({ children, unmountOnExit = true, ...rest }: iStack) {
  const navigator = useNavigator();
  const [activeIndex] = usePager();

  const lastIndex = React.Children.count(children) - 1;

  // if nested in another pan, delegate pan events to parent container on the last screen
  const activeOffsetX = activeIndex === lastIndex ? [-20, 5] : [-5, 5];

  const [popIndex, setPopIndex] = React.useState(activeIndex);
  const timerRef = React.useRef<number | undefined>(undefined);

  const previousIndex = usePrevious(activeIndex);

  React.useEffect(() => {
    clearInterval(timerRef.current);

    if (previousIndex > activeIndex) {
      // @ts-ignore
      timerRef.current = setTimeout(() => {
        setPopIndex(activeIndex);
      }, 500);
    } else {
      if (previousIndex !== activeIndex) {
        setPopIndex(activeIndex);
      }
    }
  }, [previousIndex, activeIndex]);

  return (
    <Pager
      style={{ flex: 1, overflow: 'hidden' }}
      clamp={{ prev: 0.6 }}
      panProps={{
        enabled: activeIndex > 0,
        activeOffsetX,
      }}
      {...rest}
    >
      {React.Children.map(children, (child: any, index: number) => {
        if (unmountOnExit && index > popIndex) {
          return null;
        }

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
  );
}

interface iStackContext {
  push: (amount?: number) => void;
  pop: (amount?: number) => void;
}

function useStack(): iStackContext {
  const navigator = useNavigator();
  const [activeIndex, onChange] = usePager();

  function push(amount = 1) {
    const nextIndex = activeIndex + amount;

    if (navigator.routes.length > 0) {
      const nextRoute = navigator.routes[nextIndex];

      navigator.navigate(nextRoute);
      return;
    }

    onChange(nextIndex);
  }

  function pop(amount = 1) {
    const nextIndex = activeIndex - amount;

    if (navigator.routes.length > 0) {
      const nextRoute = navigator.routes[nextIndex];

      navigator.navigate(nextRoute);
      return;
    }

    onChange(nextIndex);
  }

  return {
    push,
    pop,
  };
}

function usePrevious(value: any) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = React.useRef<any>();

  // Store current value in ref
  React.useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export { Stack, useStack };
