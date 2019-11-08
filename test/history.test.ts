import {
  resolve,
  getNextRoute,
  getParams,
  pick,
  resolveBasepath,
  history,
  back,
} from '../src/history';

test('resolve() absolute routes', () => {
  const location = `/app/home/profile/one`;

  const happy = `/app/home/profile/two`;
  expect(resolve(happy, '', location)).toEqual(happy);

  const happier = `/app/home/profile/two`;
  expect(resolve(happier, '', location)).toEqual(`/app/home/profile/two`);

  const happiest = `/123/home/456?value=hello`;
  expect(resolve(happiest, '', location)).toEqual(`/123/home/456?value=hello`);

  const sad = `/:123/test`;
  expect(() => resolve(sad, '', location)).toThrowError();

  const weird = `/`;
  expect(resolve(weird, '', location)).toEqual(`/`);
});

test('resolve() pushing routes', () => {
  const location = `/app/home/profile`;
  const basepath = '/app/:123/profile';

  const happy = 'two';
  expect(resolve(happy, basepath, location)).toEqual(`/app/home/profile/two`);

  const happier = 'one/two';
  expect(resolve(happier, basepath, location)).toEqual(
    `/app/home/profile/one/two`
  );

  const happiest = 'one/one?test=value';
  expect(resolve(happiest, basepath, location)).toEqual(
    `/app/home/profile/one/one?test=value`
  );

  const sad = `:param`;
  expect(() => resolve(sad, basepath, location)).toThrowError();
});

test('resolve() relative routes', () => {
  const location = `/hello/joe`;
  const basepath = '/hello/:joe';

  const happy = `./456`;
  expect(resolve(happy, basepath, location)).toEqual('/hello/joe/456');

  const happier = `../456`;
  expect(resolve(happier, basepath, location)).toEqual(`/hello/456`);

  const happiest = `../`;
  expect(resolve(happiest, basepath, location)).toEqual('/hello');

  const crazy = `../../123/../123/456/../456`;
  expect(resolve(crazy, basepath, location)).toEqual('/123/456');

  const sad = `../:nope`;
  expect(() => resolve(sad, basepath, location)).toThrowError();

  const rootTo = '/';
  expect(resolve(rootTo, basepath, location)).toEqual('/');
});

test('getNextRoute()', () => {
  let location = `/app/home/settings/profile`;

  const happy = `/app/home`;
  expect(getNextRoute(location, happy)).toEqual('settings/profile');

  const happier = `/app/:home/settings`;
  expect(getNextRoute(location, happier)).toEqual('profile');

  const happiest = '/:i/:am/:happy';
  expect(getNextRoute(location, happiest)).toEqual('profile');

  const sad = `/app/home/settings/profile/omg`;
  expect(getNextRoute(location, sad)).toEqual(undefined);

  const sadder = `/app/not-home/settings`;
  expect(getNextRoute(location, sadder)).toEqual(undefined);

  const saddest = `/:app/:home/profile`;
  expect(getNextRoute(location, saddest)).toEqual(undefined);

  // navigator has path the same length as location -- it's not a match
  // because we're looking for the `next route` which has to be defined
  const weird = `/:app/:home:/:settings/:profile`;
  expect(getNextRoute(location, weird)).toEqual('/');

  // root path
  const lc = '/';

  expect(getNextRoute(lc)).toEqual('/');
});

test('getParams()', () => {
  const location = '/123/456/789';

  const happy = '/:param';
  expect(getParams(happy, location)).toEqual({ param: '123' });

  const happier = '/:one/:two';
  expect(getParams(happier, location)).toEqual({ one: '123', two: '456' });

  const happiest = '/one/two/:three?test=value';
  expect(getParams(happiest, location)).toEqual({ three: '789' });
});

test('pick()', () => {
  const routes = ['home', 'search', 'library'];
  const matchingRoute = `library/music/playlists/feed`;

  expect(pick(routes, matchingRoute)).toEqual(2);

  const routes2 = ['music', 'podcasts'];
  const m2 = `music/playlists/feed`;
  expect(pick(routes2, m2)).toEqual(0);

  const routes3 = ['/', 'profile/:id'];
  const m3 = 'profile/3';
  expect(pick(routes3, m3)).toEqual(1);

  const sad = ['profile/:id'];
  const m4 = 'profile';

  expect(pick(sad, m4)).toEqual(0);

  const result = pick(['/', 'two/:id'], 'two');
  expect(result).toEqual(1);
});

test('pick() w/ root route `/`', () => {
  const routes = ['/', 'profile'];
  const matchingRoute = `library/music`;

  expect(pick(routes, matchingRoute)).toEqual(0);
});

test('back() function works', () => {
  history.reset();

  history.navigate('/one/two');
  history.navigate('/two/three');
  history.back();

  expect(history.location).toEqual('/one/two');

  history.navigate('/four/five');
  expect(history.location).toEqual('/four/five');

  history.back(2);
  expect(history.location).toEqual('/');

  // nothing happens when there is nothing to go back to
  expect(history.index).toEqual(0);
  history.back();
  expect(history.location).toEqual('/');

  history.navigate('/three/four');
  back();
  expect(history.location).toEqual('/');

  history.navigate('/five/six');
  history.navigate('/seven/eight');
  back(2);
  expect(history.location).toEqual('/');
});

test('init with empty initial path defaults to root', () => {
  history.reset();
  history.init();

  expect(history.location).toEqual('/');
});

test('resolveBasepath replaces param values with corresponding location values', () => {
  const result = resolveBasepath('two/:id', '/');
  expect(result).toEqual('two');
});
