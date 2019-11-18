import React from 'react';
import { PagerProvider, useFocus } from './pager';
import { getNextRoute, pick, resolveBasepath } from './history';
import { useLocation, useBasepath, useHistory } from './history-component';

export interface iNavigator {
  children: React.ReactNode;
  routes?: string[];
  initialIndex?: number;
  onChange?: (index: number, route: string) => void;
}

export interface iNavigatorContext {
  routes: string[];
  activeIndex: number;
  focused: boolean;
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
  const history = useHistory();
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
        history.navigate(basepath || '/');
        return;
      }

      if (nextRoute.includes(':')) {
        nextRoute = resolveBasepath(nextRoute, history.location);
      }

      history.navigate(`${basepath}/${nextRoute}`);
    }
  }

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
    routes: cleanRoutes,
    activeIndex,
    focused: routeFocused,
  };

  return (
    <PagerProvider activeIndex={activeIndex} onChange={handleGestureChange}>
      <NavigatorContext.Provider value={context}>
        {children}
      </NavigatorContext.Provider>
    </PagerProvider>
  );
}

// important to throw an error here as navigator is required for routing to work
function useNavigator(): iNavigatorContext {
  const context = React.useContext(NavigatorContext);

  if (!context) {
    throw new Error(`useNavigator() must be used within a <Navigator />`);
  }

  return context;
}

export { useNavigator, Navigator };

function stripSlashes(str: string) {
  if (str === '/') {
    return str;
  }

  return str.replace(/(^\/+|\/+$)/g, '');
}
