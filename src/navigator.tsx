import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { PagerProvider, useFocus } from './pager';
import {
  getNextRoute,
  pick,
  getParams,
  resolveBasepath,
  history,
} from './history';
import { useLocation, useBasepath } from './history-component';
import { ViewProps } from 'react-native';

interface iNavigator {
  children: React.ReactNode;
  routes?: string[];
  initialIndex?: number;
  onChange?: (nextRoute: string, location: string) => void;
}

interface iNavigatorContext {
  navigate: (to: string) => void;
  back: (amount?: number) => void;
  routes: string[];
  activeIndex: number;
}

const { Value } = Animated;

const NavigatorContext = React.createContext<undefined | iNavigatorContext>(
  undefined
);

function Navigator({
  children,
  routes = [],
  initialIndex = 0,
  onChange: parentOnChange,
}: iNavigator) {
  const basepath = useBasepath();
  const location = useLocation();
  const focused = useFocus();

  const [activeIndex, onChange] = React.useState(() => {
    const matchingRoute = getNextRoute(location, basepath);

    if (matchingRoute) {
      const nextIndex = pick(routes, matchingRoute);

      if (nextIndex !== -1) {
        return nextIndex;
      }
    }

    return initialIndex;
  });

  const animatedIndex = React.useRef(new Value(activeIndex)).current;

  function handleGestureChange(nextIndex: number) {
    onChange(nextIndex);

    let nextRoute = routes[nextIndex];

    if (nextRoute) {
      if (nextRoute === '/') {
        navigate(basepath);
        return;
      }

      if (nextRoute.includes(':')) {
        nextRoute = resolveBasepath(nextRoute, history.location);
      }

      navigate(`${basepath}/${nextRoute}`);
    }
  }

  function navigate(to: string) {
    history.navigate(to, basepath);
  }

  const back = function(amount?: number) {
    history.back(amount || 1);
  };

  React.useEffect(() => {
    // only update if the navigator is currently focused and there was a relevant location change
    if (focused) {
      const matchingRoute = getNextRoute(location, basepath);
      if (matchingRoute) {
        const nextIndex = pick(routes, matchingRoute);

        if (nextIndex !== activeIndex && nextIndex !== -1) {
          onChange(nextIndex);
          return;
        }
      }
    }
  }, [location, focused, routes, basepath]);

  React.useEffect(() => {
    if (activeIndex !== undefined) {
      parentOnChange && parentOnChange(routes[activeIndex], location);
    }
  }, [activeIndex, parentOnChange]);

  const context = {
    navigate,
    back,
    routes,
    activeIndex,
  };

  return (
    <PagerProvider activeIndex={activeIndex} onChange={handleGestureChange}>
      <NavigatorContext.Provider value={context}>
        {children}
      </NavigatorContext.Provider>
    </PagerProvider>
  );
}

interface iLink extends ViewProps {
  to: string;
  children: React.ReactNode;
}

function Link({ to, children, ...rest }: iLink) {
  const navigator = useNavigator();

  function handlePress() {
    navigator.navigate(to);
  }

  return (
    <TouchableOpacity
      onPress={handlePress}
      accessibilityRole="link"
      accessibilityHint={`Go to ${to}`}
      {...rest}
    >
      {children}
    </TouchableOpacity>
  );
}

function useNavigator(): iNavigatorContext {
  const context = React.useContext(NavigatorContext);

  if (!context) {
    throw new Error(`useNavigator() must be used within a <Navigator />`);
  }

  return context;
}

function useParams<T>() {
  const location = useLocation();
  const basepath = useBasepath();
  const [params, setParams] = React.useState<undefined | T>();
  const focused = useFocus();

  React.useEffect(() => {
    if (focused) {
      setParams(getParams(basepath, location));
    }
  }, [focused, basepath, location]);

  return params;
}

export { useNavigator, useParams, Navigator, Link };
