import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PagerProvider, useFocus } from './pager';
import {
  getNextRoute,
  pick,
  getParams,
  resolveBasepath,
  history,
} from './history';
import { useLocation, useBasepath, useNavigate } from './history-component';
import { ViewProps } from 'react-native';

interface iNavigator {
  children: React.ReactNode;
  routes?: string[];
  initialIndex?: number;
  onChange?: (index: number, route: string) => void;
}

interface iNavigatorContext {
  navigate: (to: string) => void;
  back: (amount?: number) => void;
  routes: string[];
  activeIndex: number;
}

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

  const cleanRoutes = React.useMemo(() => routes.map(stripSlashes), [routes]);

  const isRouter = routes.length > 0;

  const [routeFocused, setRouteFocused] = React.useState(!isRouter);

  const [activeIndex, onChange] = React.useState(() => {
    const matchingRoute = getNextRoute(location, basepath);

    if (matchingRoute) {
      const nextIndex = pick(cleanRoutes, matchingRoute);

      if (nextIndex !== -1) {
        setRouteFocused(true);
        return nextIndex;
      }
    }

    return initialIndex;
  });

  function handleGestureChange(nextIndex: number) {
    onChange(nextIndex);

    let nextRoute = cleanRoutes[nextIndex];

    if (nextRoute) {
      if (nextRoute === '/') {
        navigate(basepath || '/');
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
    history.back(amount);
  };

  React.useEffect(() => {
    // only update if the navigator is currently focused and there was a relevant location change
    if (focused && isRouter) {
      const matchingRoute = getNextRoute(location, basepath);

      if (matchingRoute) {
        const nextIndex = pick(cleanRoutes, matchingRoute);

        if (nextIndex !== -1) {
          setRouteFocused(true);
          onChange(nextIndex);

          return;
        }
      }

      setRouteFocused(false);
    }
  }, [location, focused, cleanRoutes, basepath, isRouter]);

  React.useEffect(() => {
    if (activeIndex !== undefined) {
      parentOnChange && parentOnChange(activeIndex, routes[activeIndex]);
    }
  }, [activeIndex, parentOnChange]);

  const context = {
    navigate,
    back,
    routes: cleanRoutes,
    activeIndex,
  };

  return (
    <PagerProvider activeIndex={activeIndex} onChange={handleGestureChange}>
      <NavigatorContext.Provider value={context}>
        <RouteFocusContext.Provider value={routeFocused}>
          {children}
        </RouteFocusContext.Provider>
      </NavigatorContext.Provider>
    </PagerProvider>
  );
}

interface iLink extends ViewProps {
  to: string;
  children: React.ReactNode;
}

function Link({ to, children, ...rest }: iLink) {
  const navigate = useNavigate();

  function handlePress() {
    navigate(to);
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

function stripSlashes(str: string) {
  if (str === '/') {
    return str;
  }

  return str.replace(/(^\/+|\/+$)/g, '');
}

const RouteFocusContext = React.createContext(true);

function useRouteFocused() {
  const routeFocused = React.useContext(RouteFocusContext);

  return routeFocused;
}

export { useNavigator, useParams, Navigator, Link, useRouteFocused };
