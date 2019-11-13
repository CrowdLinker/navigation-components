module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          'navigation-components': '../src/index',
          // '@crowdlinker/react-native-pager': '../../pager/src/index',
        },
      },
    ],
  ],
};
