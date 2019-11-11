import React from 'react';
import {
  Pager,
  iPageInterpolation,
  usePager,
  iPager,
  IndexProvider,
  FocusProvider,
} from './pager';
import { useNavigator } from './navigator';
import { BasepathProvider } from './history-component';
import { AccessibleScreen } from './accessible-screen';

const modalConfig: iPageInterpolation = {
  zIndex: offset => offset,
};

interface iModal extends iPager {
  children: [React.ReactNode, React.ReactNode];
  modalIndex?: number;
  active?: boolean;
}

function Modal({ children, modalIndex = 1, active, ...rest }: iModal) {
  const [activeIndex, onChange] = usePager();
  const navigator = useNavigator();

  const screenIndex = modalIndex === 1 ? 0 : 1;

  if (navigator.routes.length > 2) {
    throw new Error(`<Modal /> should only have at most 2 children`);
  }

  function show() {
    const route = navigator.routes[modalIndex];

    if (route) {
      navigator.navigate(route);
      return;
    }

    onChange(modalIndex);
  }

  function hide() {
    const route = navigator.routes[screenIndex];

    if (route) {
      navigator.navigate(route);
      return;
    }

    onChange(screenIndex);
  }

  function toggle() {
    activeIndex === modalIndex ? hide() : show();
  }

  React.useEffect(() => {
    if (active !== undefined) {
      active ? show() : hide();
    }
  }, [active]);

  return (
    <ModalContext.Provider value={{ show, hide, toggle }}>
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
        style={{ flex: 1, overflow: 'hidden' }}
        {...rest}
      >
        {React.Children.map(children, (child: any, index: number) => {
          const route = navigator.routes[index];
          const isModal = index === modalIndex;

          if (route) {
            return (
              <BasepathProvider value={route}>
                <IndexProvider index={index}>
                  <FocusProvider focused={index === activeIndex}>
                    <AccessibleScreen accessibilityViewIsModal={isModal}>
                      {child}
                    </AccessibleScreen>
                  </FocusProvider>
                </IndexProvider>
              </BasepathProvider>
            );
          }

          return (
            <IndexProvider index={index}>
              <FocusProvider focused={index === activeIndex}>
                <AccessibleScreen accessibilityViewIsModal={isModal}>
                  {child}
                </AccessibleScreen>
              </FocusProvider>
            </IndexProvider>
          );
        })}
      </Pager>
    </ModalContext.Provider>
  );
}

interface iModalContext {
  show: () => void;
  hide: () => void;
  toggle: () => void;
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
