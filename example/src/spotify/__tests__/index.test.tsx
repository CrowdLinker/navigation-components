import React from 'react';
import {SpotifyApp} from '../index';
import {render, navigate, defaults, fireEvent} from 'navigation-test-utils';

test('render() ', () => {
  const {getFocused, debug} = render(<SpotifyApp />, {
    options: {debug: {omitProps: [...defaults.omitProps, 'data']}},
  });
  // debug()
  // navigate('/main/music/artists');
  // getFocused().debug()

  navigate('/main/music');

  // getFocused().debug();

  fireEvent.press(getFocused().getByText('artists'));
  getFocused().debug();

  fireEvent.press(getFocused().getByText('1'));
  fireEvent.press(getFocused().getByText('Next'));

  getFocused().debug();
});
