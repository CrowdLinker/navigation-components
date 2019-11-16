import React from 'react';
import {
  Navigator,
  Tabs,
  Link,
  Switch,
  Header,
  NativeStack,
  useParams,
  navigate,
  Stack,
  Home,
} from 'navigation-components';
import {View, Text, Button} from 'react-native';
import {colors, styles, Feed, FeedHeaders, Slide} from '../shared';

const mainRoutes = ['main', 'profile', 'details'];
function Library() {
  return (
    <Home>
      <Navigator routes={mainRoutes}>
        <Stack>
          <UserFeeds />
          <Profiles />
          <Details />
        </Stack>
      </Navigator>
    </Home>
  );
}

const routes = ['music', 'podcasts'];

function UserFeeds() {
  return (
    <Navigator routes={routes}>
      <FeedHeaders routes={routes} style={styles.header} />

      <Tabs>
        <UserFeed routes={['playlists', 'artists', 'albums']} />
        <UserFeed routes={['episodes', 'downloads', 'shows']} />
      </Tabs>

      <Button
        title="Navigate abs"
        onPress={() => navigate('/library/main/music/artists')}
      />
    </Navigator>
  );
}

function Feeds({routes}: any) {
  return (
    <Tabs>
      {routes.map((route: string) => {
        return (
          // @ts-ignore
          <Feed
            key={route}
            // @ts-ignore
            type={route}
            // @ts-ignore
            items={data[route]}
            row={(item: any) => (
              <Link
                to={`~/profile/${route}/${item.id}`}
                style={{borderWidth: 1, height: 40, marginVertical: 5}}>
                <Text>{item.id}</Text>
              </Link>
            )}
          />
        );
      })}
    </Tabs>
  );
}

function UserFeed({routes}: any) {
  return (
    <Navigator routes={routes} initialIndex={0}>
      <FeedHeaders routes={routes} style={styles.subheader} />
      <Feeds routes={routes} />
    </Navigator>
  );
}

function Profiles() {
  return (
    <Navigator routes={['albums/:id', 'artists/:id', 'playlists/:id']}>
      <Switch>
        <Profile type="album">
          <Text>Album</Text>
        </Profile>

        <ArtistProfile />

        <Profile type="playlist">
          <Text>Playlist</Text>
        </Profile>
      </Switch>
    </Navigator>
  );
}

function Details() {
  return (
    <Navigator routes={['album', 'artist', 'playlist']}>
      <Switch>
        <Profile type="album">
          <Text>Album</Text>
        </Profile>

        <ArtistProfile />

        <Profile type="playlist">
          <Text>Playlist</Text>
        </Profile>
      </Switch>
    </Navigator>
  );
}

function ArtistProfile() {
  return (
    <Slide index={1}>
      <Text>Artist Profile</Text>
      <Link to="~/details/album">
        <Text>Next</Text>
      </Link>
    </Slide>
  );
}

function Profile({children}: any) {
  const params = useParams<{id?: string}>();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>ID: {`${params && params.id}`}</Text>
      {children}
    </View>
  );
}

export {Library};

const playlists: any[] = [
  {id: 0, name: 'Liked Songs'},
  {id: 1, name: 'Good Albums'},
  {id: 2, name: 'Your Top Songs 2019'},
  {id: 3, name: 'Novacane'},
  {id: 4, name: 'Across the Room'},
  {id: 5, name: 'New World Coming'},
  {id: 6, name: 'Nelson'},
  {id: 7, name: 'Your Top Songs 2019'},
  {id: 8, name: 'Novacane'},
  {id: 9, name: 'Across the Room'},
  {id: 10, name: 'New World Coming'},
  {id: 11, name: 'Nelson'},
  {id: 12, name: 'Nelson'},
  {id: 13, name: 'Your Top Songs 2019'},
  {id: 14, name: 'Novacane'},
  {id: 15, name: 'Across the Room'},
  {id: 16, name: 'New World Coming'},
  {id: 17, name: 'Nelson'},
  {id: 18, name: 'Nelson'},
  {id: 19, name: 'Your Top Songs 2019'},
  {id: 20, name: 'Novacane'},
  {id: 21, name: 'Across the Room'},
  {id: 22, name: 'New World Coming'},
  {id: 23, name: 'Nelson'},
];

const artists = [
  {id: 0, name: 'Broken Social Scene'},
  {id: 1, name: 'Frank Ocean'},
  {id: 2, name: 'Shovels & Rope'},
  {id: 3, name: 'Souls Of Mischief'},
  {id: 4, name: 'Local Natives'},
  {id: 5, name: 'Made in Heights'},
  {id: 6, name: 'PUP'},
  {id: 7, name: 'Whitney'},
  {id: 8, name: 'Souls Of Mischief'},
  {id: 9, name: 'Local Natives'},
  {id: 10, name: 'Made in Heights'},
  {id: 11, name: 'PUP'},
  {id: 12, name: 'Whitney'},
];

const albums = [
  {id: 0, name: 'For Emma, Forever Ago'},
  {id: 1, name: 'channel ORANGE'},
  {id: 2, name: 'In Rainbows'},
  {id: 3, name: `93 'til Infinity`},
  {id: 4, name: 'Instant Vintage'},
  {id: 5, name: 'Sunlit Youth'},
  {id: 6, name: 'Hey, Ma'},
];

const episodes = [
  {
    id: 0,
    name: 'Hasty Treat - The TLD Game',
  },
  {
    id: 1,
    name: 'Teaching Code with Angie Jones',
  },
  {
    id: 2,
    name: '379: Making Money on the Web',
  },
];

const downloads = [
  {
    id: 0,
    name: '1. Hunting Season',
  },
  {
    id: 1,
    name: '#148 Bedbugs and Aliens',
  },
  {
    id: 2,
    name: '65: Jonathan Cutrel on the Future of Work -- Part 1',
  },
];

const shows = [
  {
    id: 0,
    name: 'React Podcast',
  },
  {
    id: 1,
    name: 'Hello Internet',
  },
];

const data = {
  playlists,
  artists,
  albums,
  episodes,
  shows,
  downloads,
};
