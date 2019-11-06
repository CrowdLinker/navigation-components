import React, {memo} from 'react';
import {View, StyleSheet, Text, ViewStyle} from 'react-native';
import {Link, useInterpolation} from 'react-navigation-library';
import Animated from 'react-native-reanimated';
import {FlatList} from 'react-native-gesture-handler';

const {createAnimatedComponent} = Animated;

const colors = [
  'aquamarine',
  'coral',
  'gold',
  'cadetblue',
  'crimson',
  'darkorange',
  'darkmagenta',
  'salmon',
];

interface iSlide {
  index: number;
  children?: React.ReactNode;
}

function Slide({index, children}: iSlide) {
  return (
    <View
      style={[styles.slide, {backgroundColor: colors[index % colors.length]}]}>
      {children || <Text>{`Screen: ${index}`}</Text>}
    </View>
  );
}

interface iActiveOpacity {
  index: number;
  children: React.ReactNode;
}

function ActiveOpacity({index, children}: iActiveOpacity) {
  const styles = useInterpolation(
    {
      // @ts-ignore
      opacity: {
        inputRange: [-1, 0, 1],
        outputRange: [0.5, 1, 0.5],
        extrapolate: 'clamp',
      },
    },

    index,
  );

  return <Animated.View style={styles}>{children}</Animated.View>;
}

interface iRow {
  id: string | number;
}

interface iFeed<T> {
  items: T[];
  row: (item: T, props: any) => any;
  style?: ViewStyle;
}

function Feed<T extends iRow>({items = [], row, style, ...rest}: iFeed<T>) {
  function renderItem({item}: {item: T}) {
    return row(item, rest);
  }

  return (
    <AnimatedFlatList
      style={style || {flex: 1, padding: 10}}
      data={items}
      renderItem={renderItem}
      bounces={false}
      keyExtractor={(item: T) => `${item.id}`}
      {...rest}
    />
  );
}

function FeedHeaders({routes, style}: any) {
  return (
    <View style={{flexDirection: 'row'}}>
      {routes.map((route: string, index: number) => {
        return (
          <Link to={route} key={route} style={{padding: 5, borderWidth: 1}}>
            <ActiveOpacity index={index}>
              <Text style={style}>{route}</Text>
            </ActiveOpacity>
          </Link>
        );
      })}
    </View>
  );
}

const AnimatedFlatList = createAnimatedComponent(FlatList);

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 5,
  },

  header: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },

  subheader: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
});

export {Slide, ActiveOpacity, Feed, styles, colors, FeedHeaders};
