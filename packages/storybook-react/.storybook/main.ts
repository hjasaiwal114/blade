import { StorybookConfig } from '@storybook/react-webpack5';
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');

const config: StorybookConfig = {
  typescript: {
    check: false,
    checkOptions: {
      typescript: {
        configFile: path.resolve('./tsconfig.json'),
        configOverwrite: {
          exclude: [
            '../blade/**/**.stories.tsx',
            '../blade/**/**.stories.internal.tsx',
            '../blade/**/**.native.ts',
            '../blade/**/**.native.tsx',
            '../blade/**/**.native.test.ts',
            '../blade/**/**.native.test.tsx',
          ],
          compilerOptions: {
            noEmit: true,
            emitDeclarationOnly: false,
            moduleSuffixes: ['.web', ''],
          },
        },
      },
    },
  },
  refs: {
    '@storybook/design-system': { disable: true },
  },
  stories: [
    // '../../blade/docs/**/*.stories.mdx',
    '../../blade/docs/**/*.stories.@(ts|tsx|js|jsx)',
    // '../../blade/src/**/*.stories.mdx',
    '../../blade/src/**/*.stories.@(ts|tsx|js|jsx)',
    // '../../src/**/*.stories.internal.mdx',
    // '../../src/**/*.stories.internal.@(ts|tsx|js|jsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/preset-create-react-app',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {
      fastRefresh: false,
    },
  },
  env: (config) => ({
    ...config,
    GITHUB_SHA: process.env.GITHUB_SHA || '',
    GITHUB_REF: process.env.GITHUB_REF || '',
  }),
  staticDirs: ['../../blade/public'],
  babel: async (options) => ({
    only: ['../blade'],
    presets: [
      ['@babel/preset-env', { modules: false, loose: true }],
      '@babel/preset-typescript',
      ['@babel/preset-react', { runtime: 'automatic' }],
    ],

    plugins: [
      [
        'module-resolver',
        {
          '~src': './src',
          '~components': './src/components',
          '~utils': './src/utils',
          '~tokens': './src/tokens',
        },
      ],
      [
        '@babel/plugin-transform-runtime',
        {
          helpers: true,
          regenerator: true,
        },
      ],
      [
        'babel-plugin-styled-components',
        {
          displayName: true,
          pure: false,
          ssr: true,
        },
      ],
      // ['react-hot-loader/babel', { skipEnvCheck: true }],
    ],
  }),
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    config.resolve.extensions = [
      '.web.tsx',
      '.web.ts',
      '.tsx',
      '.ts',
      '.tsx',
      '.web.js',
      '.mjs',
      '.js',
      '.jsx',
      '.json',
    ];

    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      }),
    ];

    // Return the altered config
    return {
      ...config,
      // While developing components storybook throws error
      // if there are eslint errors which is annoying
      // thus disabled it.
      plugins: config.plugins.filter((plugin) => {
        if (plugin.constructor.name === 'ESLintWebpackPlugin') {
          return false;
        }
        return true;
      }),
      module: {
        ...config.module,
        rules: [
          ...config.module.rules,
          {
            test: /\.(ts|tsx)$/,
            loader: 'babel-loader',
            options: {
              configFile: './.babelrc.js',
            },
          },
        ],
      },
    };
  },
};
export default config;
