import React from 'react';
import { Pager, iPageInterpolation, usePager, iPager } from './pager';
import { useNavigator } from './navigator';
import { BasepathProvider } from './history-component';
import { AccessibleScreen } from './accessible-screen';

const modalConfig: iPageInterpolation = {
  zIndex: offset => offset,
};

interface iModal extends iPager {
  children: React.ReactNode[];
  modalIndex?: number;
}

function Modal({ children, modalIndex: parentModalIndex, ...rest }: iModal) {
  const [activeIndex, onChange] = usePager();
  const navigator = useNavigator();
  const [previousIndex, setPreviousIndex] = React.useState(-1);
  const [state, setState] = React.useState({});

  // // override default index to be 0
  // const modalActiveIndex = activeIndex === -1 ? 0 : activeIndex;

  // the last child will be the modal element
  const modalIndex =
    parentModalIndex !== undefined
      ? parentModalIndex
      : React.Children.count(children) - 1;

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
        activeIndex={activeIndex}
        type="vertical"
        clamp={{
          prev: 0,
        }}
        clampDrag={{
          prev: activeIndex === modalIndex ? 1 : 0,
          next: 0,
        }}
        pageInterpolation={modalConfig}
        {...rest}
      >
        {React.Children.map(children, (child: any, index: number) => {
          const route = navigator.routes[index];
          const isModal = index === modalIndex;

          if (route) {
            return (
              <BasepathProvider value={route}>
                <AccessibleScreen accessibilityViewIsModal={isModal}>
                  {child}
                </AccessibleScreen>
              </BasepathProvider>
            );
          }

          return <AccessibleScreen>{child}</AccessibleScreen>;
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
