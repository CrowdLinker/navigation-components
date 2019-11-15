import React from 'react';
import {
  useHistory,
  useBasepath,
  useLocation,
  useHomepath,
} from './history-component';
import { useFocus } from './pager';
import { getParams } from './history';

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

export { useNavigate, useBack, useParams };
