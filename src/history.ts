// this is basically a simplified and worse version of @reach/router in-memory history implementation
export interface iHistory {
  init: (initialPath?: string) => void;
  navigate: (to: string, basepath?: string) => void;
  back: (amount?: number) => void;
  location: string;
  index: number;
  listen: (listener: Listener) => () => void;
  reset: () => void;
  resolve: (to: string, basepath: string) => string;
}

export type Listener = (location: string) => void;

function createHistory(): iHistory {
  let paths: string[] = ['/'];

  let index = 0;
  let listeners: Listener[] = [];

  function notify() {
    listeners.forEach(l => l(paths[index]));
  }

  return {
    get index() {
      return index;
    },

    get location() {
      return paths[index];
    },

    init: function(initialPath?: string) {
      paths[0] = initialPath || '/';
      notify();
    },

    reset: function() {
      index = 0;
      paths = ['/'];
      notify();
    },

    navigate: function(to: string, from?: string) {
      const path = paths[index];

      let next = resolve(to, from, path);

      if (next === path) {
        return;
      }

      index++;

      // // find the most recent url that looks like the one being added
      // // and if there is one, push that instead
      // if (options && options.latest) {
      //   if (paths.includes(next)) {
      //     for (let i = paths.length - 1; i >= 0; i--) {
      //       const path = paths[i];
      //       if (path.includes(next)) {
      //         next = path;
      //         break;
      //       }
      //     }
      //   }
      // }

      paths[index] = next;

      notify();
    },

    listen: function(listener) {
      listeners.push(listener);

      return function() {
        listeners = listeners.filter(l => l !== listener);
      };
    },

    back: function(amount = 1) {
      const offset = index - amount;
      const next = paths[offset];

      if (next !== undefined) {
        index = offset;

        notify();
      }
    },

    resolve: function(to: string, basepath: string) {
      return resolve(to, basepath, paths[index]);
    },
  };
}

let paramRe = /^:(.+)/;

// replace any param values in basepath with corresponding location values
function resolveBasepath(basepath: string, location: string) {
  const basepathSegments = segmentize(basepath);
  const locationSegments = segmentize(location);

  for (let i = 0; i < basepathSegments.length; i++) {
    const basepathSegment = basepathSegments[i];
    const locationSegment = locationSegments[i];

    if (basepathSegment.startsWith(':')) {
      basepathSegments[i] = locationSegment;
    }
  }

  return `${basepathSegments.filter(Boolean).join('/')}`;
}

// basepath is necessary because it provides context for relative paths
// e.g a component might have a basepath that is several segments above the
// current location, so it should resolve from its own basepath, not the current location
function resolve(to: string, from = '/', location: string): string {
  const [toPath, toQuery] = to.split('?');
  const toSegments = segmentize(toPath);

  // navigate to absolute root
  if (!toSegments.length) {
    return '/';
  }

  // do not allow params in navigate() function calls
  for (let i = 0; i < toSegments.length; i++) {
    const toSegment = toSegments[i];

    if (toSegment.startsWith(':')) {
      throw new Error(`Cannot navigate to a dynamic param: ${toSegment}`);
    }
  }

  const locationSegments = segmentize(location);

  // absolute path case -- nothing to do here
  if (to.startsWith('/')) {
    return to;
  }

  // if its not absolute, its in relative land, meaning it will be in relation
  // to the basepath provided
  const fromSegments = segmentize(from);

  // replace any param values in basepath with corresponding location values
  for (let i = 0; i < fromSegments.length; i++) {
    const fromSegment = fromSegments[i];
    const locationSegment = locationSegments[i];

    if (fromSegment.startsWith(':')) {
      fromSegments[i] = locationSegment;
    }
  }

  const allSegments = fromSegments.concat(toSegments);

  // if it's not a relative path, append to the basepath
  if (!toSegments[0].startsWith('.')) {
    let segments: string[] = [];

    segments = fromSegments.concat(toSegments);

    return addQuery(`/${segments.join('/')}`, toQuery);
  }

  // relative path -- figure out how far back in basepath to move
  // and then append the correct values
  let segments: string[] = [];

  for (let i = 0; i < allSegments.length; i++) {
    let segment = allSegments[i];

    // move up one dir and append that segment in the next loop
    if (segment === '..') {
      segments.pop();
      continue;
    }

    // skip over segment and append the next one instead
    if (segment === '.') {
      continue;
    }

    segments.push(segment);
  }

  return addQuery('/' + segments.join('/'), toQuery);
}

function segmentize(uri: string): string[] {
  // strip starting/ending slashes
  return uri
    .replace(/(^\/+|\/+$)/g, '')
    .split('/')
    .filter(Boolean);
}

function addQuery(pathname: string, query?: string) {
  return pathname + (query ? `?${query}` : '');
}

// map out changes by location segment between previous and next locations
// 1 indicates a change has occured
// this is useful to determine if a navigator should update by evaluating
// if it's relevant routes have changed
// function getChanges(current: string, next: string): number[] {
//   const changes = [];
//   const currentSegments = segmentize(current);
//   const nextSegments = segmentize(next);

//   for (let i = 0; i < nextSegments.length; i++) {
//     const currentSegment = currentSegments[i];
//     const nextSegment = nextSegments[i];

//     const change = currentSegment === nextSegment ? 0 : 1;
//     changes.push(change);
//   }

//   return changes;
// }

// return the next segment of a basepath for a given location
// location = '/app/settings/profile basepath = '/app/settings' -> 'profile'
// returns undefined if no route is found
function getNextRoute(
  location: string,
  basepath = '/',
  end?: number
): string | undefined {
  const locationSegments = segmentize(location);
  const basepathSegments = segmentize(basepath);

  // can't be a match if the basepath is longer than the location
  if (basepathSegments.length > locationSegments.length) {
    return undefined;
  }

  for (let i = 0; i < basepathSegments.length; i++) {
    const basepathSegment = basepathSegments[i];
    const locationSegment = locationSegments[i];

    // params always match so skip it
    if (basepathSegment.startsWith(':')) {
      continue;
    }

    // not an exact match, exit early
    if (locationSegment !== basepathSegment) {
      return undefined;
    }
  }

  const nextRoute = locationSegments
    .slice(basepathSegments.length, end)
    .join('/');

  return nextRoute || '/';
}

// ranks routes based on their similarity to the incoming route
// an exact match is ranked highest, next is a param match, and finally
// no match is ranked the least
function match(route: string, nextRoute: string): number {
  const routeSegments = segmentize(route);
  const nextSegments = segmentize(nextRoute);

  let rank = -1;

  if (route === '/') {
    return 0;
  }

  for (let i = 0; i < nextSegments.length; i++) {
    const routeSegment = routeSegments[i];
    const nextSegment = nextSegments[i];

    // possible match has ended
    if (!routeSegment) {
      break;
    }

    // params route
    if (routeSegment.startsWith(':')) {
      rank += 2;
      continue;
    }

    // exact match :thumbsup:
    if (routeSegment === nextSegment) {
      rank += 3;
    }

    // no match -- dock it a point
    if (routeSegment !== nextSegment) {
      rank += -1;
    }
  }

  return rank;
}

function pick(routes: string[], nextRoute: string) {
  let matchIndex = -1;
  let highestRank = -1;

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const rank = match(route, nextRoute);

    if (rank > highestRank) {
      highestRank = rank;
      matchIndex = i;
    }
  }

  return matchIndex;
}

// return params as an object corresponding to the key names in a path
// e.g  path = '/:home', location = '/123' -> { home: '123' }
function getParams<T>(path: string, location: string): T | undefined {
  let params: any;

  const [_location] = location.split('?');
  const [_path] = path.split('?');

  const pathSegments = _path.split('/');
  const locationSegments = _location.split('/');

  for (let i = 0; i < pathSegments.length; i++) {
    const paramsMatch = paramRe.exec(pathSegments[i]);
    if (paramsMatch) {
      if (!params) {
        params = {};
      }

      params[paramsMatch[1]] = locationSegments[i];
    }
  }

  return params as T;
}

const history = createHistory();

function navigate(to: string, from?: string) {
  history.navigate(to, from || history.location);
}

function back(amount?: number) {
  history.back(amount || 1);
}

export {
  createHistory,
  history,
  navigate,
  back,
  resolve,
  getParams,
  getNextRoute,
  pick,
  segmentize,
  resolveBasepath,
};
