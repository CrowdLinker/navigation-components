/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const path = require('path');
const blacklist = require('metro-config/src/defaults/blacklist');
const escape = require('escape-string-regexp');
const pak = require('../package.json');

const peerDependencies = Object.keys(pak.peerDependencies);

module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  watchFolders: [
    path.resolve(__dirname, '..'),
    path.resolve(__dirname, '../../pager'),
  ],
  resolver: {
    blacklistRE: blacklist([
      new RegExp(
        `^${escape(path.resolve(__dirname, '..', 'node_modules'))}\/.*$`,
      ),
      new RegExp(
        `^${escape(
          path.resolve(__dirname, '../../pager', 'node_modules'),
        )}\/.*$`,
      ),
      new RegExp(
        `^${escape(path.resolve(__dirname, '../../pager', 'example'))}\/.*$`,
      ),
    ]),
    providesModuleNodeModules: [
      '@babel/runtime',
      ...peerDependencies,
      '@crowdlinker/react-native-pager',
    ],
  },
};
