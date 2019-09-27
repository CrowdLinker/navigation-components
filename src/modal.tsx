import React from 'react';
import {
  Pager,
  iPageInterpolation,
  usePager,
} from '@crowdlinker/react-native-pager';
import { useNavigator } from './navigator';
import { BasepathProvider } from './history';

const modalConfig: iPageInterpolation = {
  zIndex: offset => offset,
};

interface iModal {
  children: React.ReactNode[];
}

function Modal({ children }: iModal) {
  const [activeIndex, onChange] = usePager();
  const navigator = useNavigator();
  const [previousIndex, setPreviousIndex] = React.useState(-1);
  const [state, setState] = React.useState({});

  // override default index to be 0
  const modalActiveIndex = activeIndex === -1 ? 0 : activeIndex;

  // the last child will be the modal element
  const modalIndex = React.Children.count(children) - 1;

  function show(_state?: Object) {
    setState({ ...state, ..._state });
    setPreviousIndex(activeIndex);
    onChange(modalIndex);
  }

  function hide() {
    onChange(previousIndex);
    setPreviousIndex(-1);
  }

  return (
    <ModalContext.Provider value={{ show, hide, state }}>
      <Pager
        onChange={onChange}
        activeIndex={modalActiveIndex}
        type="vertical"
        pageInterpolation={modalConfig}
        clamp={{ prev: 0 }}
        clampDrag={{ next: 0 }}
        panProps={{ enabled: activeIndex === modalIndex }}
      >
        {React.Children.map(children, (child: any, index: number) => {
          const route = navigator.routes[index];

          if (route) {
            return <BasepathProvider value={route}>{child}</BasepathProvider>;
          }

          return child;
        })}
      </Pager>
    </ModalContext.Provider>
  );
}

interface iModalContext {
  show: (state?: any) => void;
  hide: () => void;
  state?: any;
}

const ModalContext = React.createContext<undefined | iModalContext>(undefined);

function useModal(): iModalContext {
  const display = React.useContext(ModalContext);

  if (!display) {
    throw new Error(`useModal() must be used within a <Modal /> container`);
  }

  return display;
}

export { Modal, useModal };
