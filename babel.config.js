module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@crowdlinker/navigation': '../src/index',
          '@crowdlinker/react-native-pager': '../../pager/src/index',
        },
      },
    ],
  ],
};
