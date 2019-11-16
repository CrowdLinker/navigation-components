import React from 'react';
import {
  useHistory,
  useBasepath,
  useLocation,
  useHomepath,
} from './history-component';
import { useFocus, usePager } from './pager';
import { getParams } from './history';
import { useNavigator } from './navigator';

function useNavigate() {
  const history = useHistory();
  const basepath = useBasepath();
  const homePath = useHomepath();

  function navigate(to: string) {
    if (to.startsWith('~')) {
      const path = to.split('~/')[1];
      const nextPath = path ? history.resolve(path, homePath) : homePath;

      history.navigate(nextPath, basepath || '/');
      return;
    }

    history.navigate(to, basepath || '/');
  }

  return navigate;
}

function useBack() {
  const history = useHistory();

  function back(amount?: number) {
    history.back(amount);
  }

  return back;
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

function useQuery() {
  const location = useLocation();

  const [_, query] = location.split('?');

  return query;
}

function useStack() {
  const navigator = useNavigator();
  const navigate = useNavigate();
  const [activeIndex, onChange] = usePager();

  function push(amount = 1) {
    const nextIndex = activeIndex + amount;

    if (navigator.routes.length > 0) {
      const nextRoute = navigator.routes[nextIndex];

      navigate(nextRoute);
      return;
    }

    onChange(nextIndex);
  }

  function pop(amount = 1) {
    const nextIndex = activeIndex - amount;

    if (navigator.routes.length > 0) {
      const nextRoute = navigator.routes[nextIndex];

      navigate(nextRoute);
      return;
    }

    onChange(nextIndex);
  }

  return {
    push,
    pop,
  };
}

function useTabs() {
  const [_, onChange] = usePager();
  const navigator = useNavigator();
  const navigate = useNavigate();

  function goTo(index: number) {
    const route = navigator.routes[index];

    if (route) {
      navigate(route);
      return;
    }

    onChange(index);
  }

  return {
    goTo,
  };
}

export { useNavigate, useBack, useParams, useStack, useTabs, useQuery };
