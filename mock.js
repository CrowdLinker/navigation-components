jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View, Text, Image, Animated } = require('react-native');

  function NOOP() {}

  class Code extends React.Component {
    render() {
      return null;
    }
  }

  const mock = {
    __esModule: true,

    default: {
      SpringUtils: {
        makeDefaultConfig: NOOP,
        makeConfigFromBouncinessAndSpeed: NOOP,
        makeConfigFromOrigamiTensionAndFriction: NOOP,
      },

      View,
      Text,
      Image,
      ScrollView: Animated.ScrollView,
      Code,

      Clock: NOOP,
      Node: NOOP,
      Value: function() {
        return {
          setValue: NOOP,
        };
      },

      Extrapolate: {
        EXTEND: 'extend',
        CLAMP: 'clamp',
        IDENTITY: 'identity',
      },

      add: NOOP,
      sub: NOOP,
      multiply: NOOP,
      divide: NOOP,
      pow: NOOP,
      modulo: NOOP,
      sqrt: NOOP,
      log: NOOP,
      sin: NOOP,
      cos: NOOP,
      tan: NOOP,
      acos: NOOP,
      asin: NOOP,
      atan: NOOP,
      exp: NOOP,
      round: NOOP,
      floor: NOOP,
      ceil: NOOP,
      lessThan: NOOP,
      eq: NOOP,
      greaterThan: NOOP,
      lessOrEq: NOOP,
      greaterOrEq: NOOP,
      neq: NOOP,
      and: NOOP,
      or: NOOP,
      defined: NOOP,
      not: NOOP,
      set: NOOP,
      concat: NOOP,
      cond: NOOP,
      block: NOOP,
      call: NOOP,
      debug: NOOP,
      onChange: NOOP,
      startClock: NOOP,
      stopClock: NOOP,
      clockRunning: NOOP,
      event: NOOP,
      abs: NOOP,
      acc: NOOP,
      color: NOOP,
      diff: NOOP,
      diffClamp: NOOP,
      interpolate: NOOP,
      max: NOOP,
      min: NOOP,

      decay: NOOP,
      timing: NOOP,
      spring: NOOP,

      proc: () => NOOP,

      useCode: NOOP,
      createAnimatedComponent: Component => Component,
    },

    Easing: {
      linear: NOOP,
      ease: NOOP,
      quad: NOOP,
      cubic: NOOP,
      poly: () => NOOP,
      sin: NOOP,
      circle: NOOP,
      exp: NOOP,
      elastic: () => NOOP,
      back: () => NOOP,
      bounce: () => NOOP,
      bezier: () => NOOP,
      in: () => NOOP,
      out: () => NOOP,
      inOut: () => NOOP,
    },
  };

  mock.default.Value = function() {
    return {
      setValue: function() {},
    };
  };

  function MockView(props) {
    React.useEffect(() => {
      props.onLayout &&
        props.onLayout({
          nativeEvent: { layout: { width: 100, height: 100 } },
        });
    }, []);

    return React.createElement(View, props, props.children);
  }

  mock.default.View = MockView;

  mock.default.useCode = function() {};

  return mock;
});

jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  const TouchableOpacity = require('react-native/Libraries/Components/Touchable/TouchableOpacity');
  const Flatlist = require('react-native/Libraries/Lists/FlatList');
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {},
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    /* Buttons */
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    TouchableOpacity: TouchableOpacity,
    /* Other */
    FlatList: Flatlist,
    gestureHandlerRootHOC: jest.fn(),
    Directions: {},
  };
});

jest.mock('react-native/Libraries/Linking/Linking', () => {
  let callbacks = [];

  return {
    openLink: ({ url }) => callbacks.map(cb => cb({ url })),
    getInitialURL: jest.fn().mockResolvedValue(''),
    addEventListener: (_, cb) => callbacks.push(cb),
    removeEventListener: (_, cb) =>
      (callbacks = callbacks.filter(c => c !== cb)),
  };
});
