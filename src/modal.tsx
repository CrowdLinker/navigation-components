import React from 'react';
import { Pager, iPageInterpolation, usePager, iPager } from './pager';
import { useNavigator } from './navigator';
import { useNavigate } from './hooks';
import { BasepathProvider } from './history-component';
import { AccessibleScreen } from './accessible-screen';

const modalConfig: iPageInterpolation = {
  zIndex: offset => offset,
};

interface iModal extends iPager {
  children: [React.ReactNode, React.ReactNode];
  modalIndex?: number;
  active?: boolean;
  onClose?: () => void;
}

function Modal({ children, modalIndex = 1, onClose, active, ...rest }: iModal) {
  const [activeIndex, onChange] = usePager();
  const navigator = useNavigator();

  const navigate = useNavigate();

  const screenIndex = modalIndex === 1 ? 0 : 1;

  if (navigator.routes.length > 2) {
    throw new Error(`<Modal /> should have at most 2 children`);
  }

  function show() {
    const route = navigator.routes[modalIndex];

    if (route) {
      navigate(route);
      return;
    }

    onChange(modalIndex);
  }

  function hide() {
    const route = navigator.routes[screenIndex];

    if (route) {
      navigate(route);
      return;
    }

    onChange(screenIndex);
  }

  function toggle() {
    activeIndex === modalIndex ? hide() : show();
  }

  const previousIndex = usePrevious(activeIndex);

  React.useEffect(() => {
    if (active !== undefined) {
      active ? show() : hide();
    }

    // this is super buggy -- should be removed probably
  }, [active, previousIndex]);

  React.useEffect(() => {
    if (activeIndex === screenIndex && previousIndex === modalIndex) {
      onClose && onClose();
    }
  }, [activeIndex, previousIndex, onClose]);

  return (
    <ModalContext.Provider value={{ show, hide, toggle }}>
      <Pager
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
                <AccessibleScreen
                  accessibilityViewIsModal={isModal}
                  routeFocused={navigator.focused}
                >
                  {child}
                </AccessibleScreen>
              </BasepathProvider>
            );
          }

          return (
            <AccessibleScreen
              accessibilityViewIsModal={isModal}
              routeFocused={navigator.focused}
            >
              {child}
            </AccessibleScreen>
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

function usePrevious(value: any) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = React.useRef<any>();

  // Store current value in ref
  React.useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export { Modal, useModal };
