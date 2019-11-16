// this is basically a simplified and worse version of @reach/router in-memory history implementation
import React from 'react';
import { history as globalHistory, iHistory, navigate } from './history';
import { BackHandler, Linking } from 'react-native';
import { FocusProvider } from './pager';
import { AccessibleScreen } from './accessible-screen';

export interface iHistoryContext {
  location: string;
  changes: number[];
  navigate: (to: string, basepath: string) => void;
  back: (amount: number) => void;
}

export interface iHistoryProvider {
  children: any;
  initialPath?: string;
  scheme?: string;
  onChange?: (nextLocation: string) => void;
  history?: iHistory;
}

const HistoryContext = React.createContext<iHistory | undefined>(undefined);

function useHistory() {
  const history = React.useContext(HistoryContext);

  if (!history) {
    throw new Error(`useHistory() must be used within a <History /> subtree`);
  }

  return history;
}

function History({
  initialPath = '/',
  children,
  onChange,
  scheme = '',
  history = globalHistory,
}: iHistoryProvider) {
  const [location, setLocation] = React.useState(history.location);

  // only register listener once
  React.useEffect(() => {
    const unlisten = history.listen((location: string) => {
      setLocation(location);

      if (onChange !== undefined) {
        onChange(location);
      }
    });

    return () => {
      unlisten();
    };
  }, [history]);

  // update with any initial path provided to <History />
  React.useEffect(() => {
    history.init(initialPath);
  }, [initialPath]);

  // deep link listeners:
  React.useEffect(() => {
    Linking.getInitialURL().then(url => {
      if (url) {
        const [, path] = url.split(scheme);

        if (path) {
          history.navigate(path, history.location);
        }
      }
    });

    function listenForLink({ url }: { url?: string }) {
      if (url) {
        const [, path] = url.split(scheme);

        if (path) {
          history.navigate(path, history.location);
        }
      }
    }

    Linking.addEventListener('url', listenForLink);

    return () => {
      Linking.removeEventListener('url', listenForLink);
    };
  }, []);

  // android back button listener:
  React.useEffect(() => {
    function handleBackPress() {
      if (history.index !== 0) {
        history.back(1);
        return true;
      }

      return false;
    }

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  // only have one <History /> component per tree
  const context = React.useContext(HistoryContext);

  if (context) {
    return children;
  }

  return (
    <HistoryContext.Provider value={history}>
      <LocationProvider location={location}>
        <FocusProvider focused>
          <RelativeRoot>
            <AccessibleScreen>{children}</AccessibleScreen>
          </RelativeRoot>
        </FocusProvider>
      </LocationProvider>
    </HistoryContext.Provider>
  );
}

const BasepathContext = React.createContext('/');

function BasepathProvider({ children, value }: any) {
  const basepath = useBasepath();
  const _basepath = `${basepath}${value !== '/' ? `/${value}` : ''}`;

  return (
    <BasepathContext.Provider value={`${_basepath}`}>
      {children}
    </BasepathContext.Provider>
  );
}

function useBasepath() {
  const basepath = React.useContext(BasepathContext);

  if (basepath === '/') {
    return '';
  }

  return basepath;
}

const LocationContext = React.createContext('/');

interface iLocationProvider {
  location: string;
  children: React.ReactNode;
}

function LocationProvider({ location, children }: iLocationProvider) {
  return (
    <LocationContext.Provider value={location}>
      {children}
    </LocationContext.Provider>
  );
}

function useLocation() {
  const location = React.useContext(LocationContext);
  return location;
}

const RelativeRootContext = React.createContext('');

function RelativeRoot({ children }: any) {
  const basepath = useBasepath();

  return (
    <RelativeRootContext.Provider value={basepath}>
      {children}
    </RelativeRootContext.Provider>
  );
}

function useRelativeRoot() {
  const context = React.useContext(RelativeRootContext);
  return context;
}

export {
  useLocation,
  useBasepath,
  BasepathProvider,
  useHistory,
  History,
  RelativeRoot,
  useRelativeRoot,
};
