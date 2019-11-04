import React from 'react';
import { PagerProvider, useFocus } from '@crowdlinker/react-native-pager';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  getNextRoute,
  pick,
  getParams,
  resolveBasepath,
  history,
} from './history';
import { useLocation, useBasepath } from './history-component';

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

  function handleGestureChange(nextIndex: number) {
    onChange(nextIndex);

    const nextRoute = routes[nextIndex];

    if (nextRoute) {
      if (nextRoute === '/') {
        navigate(basepath);
        return;
      }

      navigate(`${basepath}/${nextRoute}`);
    }
  }

  function navigate(to: string) {
    if (to.includes(':')) {
      to = resolveBasepath(to, history.location);
    }
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

interface iLink {
  to: string;
  children: React.ReactNode;
  style?: any;
}

function Link({ to, children, style }: iLink) {
  const navigator = useNavigator();

  function handlePress() {
    navigator.navigate(to);
  }

  return (
    <TouchableOpacity style={style} onPress={handlePress}>
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
