import React from 'react';
import {SpotifyApp} from '../index';
import {render, navigate} from 'navigation-test-utils';

test('render() ', () => {
  const {getFocused} = render(<SpotifyApp />);
  navigate('/');
  getFocused().debug();
});
