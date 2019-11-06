import React from 'react';
import {SpotifyApp} from '../index';
import {render} from 'navigation-test-utils';

test('render() ', () => {
  const {getFocused} = render(<SpotifyApp />);

  getFocused().debug();
});
