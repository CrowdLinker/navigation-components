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
  children: React.ReactNode[];
  modalIndex?: number;
}

function Modal({ children, modalIndex: parentModalIndex, ...rest }: iModal) {
  const [activeIndex, onChange] = usePager();
  const navigator = useNavigator();

  const previousIndex = usePrevious(activeIndex);

  // the last child will be the modal element
  const modalIndex =
    parentModalIndex !== undefined
      ? parentModalIndex
      : React.Children.count(children) - 1;

  function show() {
    const route = navigator.routes[modalIndex];

    if (route) {
      navigator.navigate(route);
      return;
    }

    onChange(modalIndex);
  }

  function hide() {
    const route = navigator.routes[previousIndex];

    if (route) {
      navigator.navigate(route);
      return;
    }

    onChange(previousIndex);
  }

  function toggle() {
    activeIndex === modalIndex ? hide() : show();
  }

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
