import React from 'react';
import { render, navigate } from 'navigation-test-utils';
import { History, history } from '../src';

function customRender(ui: any) {
  const utils = render(ui, {
    wrapper: History as any,
    historyProps: {
      noWrap: true,
    },
  });

  return utils;
}

function customNavigate(to: string) {
  navigate(to, history);
}

// re-export everything
export * from '@testing-library/react-native';

// override render method
export { customRender as render, customNavigate as navigate };
