import path from 'path';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import dotenv from 'dotenv';
import webpack from 'webpack';

dotenv.config();

const CONFIG_KEYS = [
  'API_SERVICE_EXTERNAL',
  'BASE_PATH',
  'ETHEREUM_NODE_WS',
  'GRAPH_NODE_EXTERNAL',
  'HUB_ADDRESS',
  'NODE_ENV',
  'PROXY_FACTORY_ADDRESS',
  'RELAY_SERVICE_EXTERNAL',
  'SAFE_ADDRESS',
  'SAFE_FUNDER_ADDRESS',
  'SUBGRAPH_NAME',
];

const CONFIG_KEYS_OPTIONAL = [
  'EOL_NOTIFICATION',
  'ISSUANCE_RATE_MONTH',
  'SENTRY_DSN_URL',
  'STAGING_NOTIFICATION',
];

const NODE_MODULES = 'node_modules';
const PATH_ASSETS = './assets';
const PATH_DIST = './build';
const PATH_LOCALES = './locales';
const PATH_SRC = './src';

function getPath(filePath) {
  return path.resolve(__dirname, filePath);
}

const envData = CONFIG_KEYS.reduce((acc, key) => {
  // Check for missing config variables
  if (!process.env[key]) {
    throw new Error(`${key} not set for ${process.env.NODE_ENV}!`);
  }

  // Pass values over to app from given environment
  acc[key] = JSON.stringify(process.env[key]);

  return acc;
}, {});

CONFIG_KEYS_OPTIONAL.forEach((key) => {
  if (process.env[key]) {
    envData[key] = JSON.stringify(process.env[key]);
  }
});

const pkg = require('./package.json');
const corePkg = require('./node_modules/@circles/core/package.json');

envData.RELEASE_VERSION = `"${pkg.version}"`;
envData.CORE_RELEASE_VERSION = `"${corePkg.version}"`;

export default () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const filename = isDevelopment ? '[name]' : '[name]-[contenthash:4]';
  const exclude = new RegExp(NODE_MODULES);

  return {
    mode: isDevelopment ? 'development' : 'production',
    entry: {
      app: getPath(`${PATH_SRC}/index.js`),
    },
    output: {
      filename: `${filename}.js`,
      sourceMapFilename: `${filename}.js.map`,
      path: getPath(PATH_DIST),
      publicPath: '/',
    },
    resolve: {
      modules: [NODE_MODULES],
      alias: {
        '%': getPath(PATH_ASSETS),
        locales: getPath(PATH_LOCALES),
        '~': getPath(PATH_SRC),
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude,
          use: ['babel-loader', 'eslint-loader'],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
        {
          test: /\.(png|jp(e?)g|gif|woff(2?)|ttf|eot)$/,
          exclude,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: `[path]${filename}.[ext]`,
              },
            },
          ],
        },
      ],
    },
    devtool: 'source-map',
    devServer: {
      clientLogLevel: 'silent',
      contentBase: getPath(PATH_DIST),
      historyApiFallback: true,
      liveReload: false,
    },
    optimization: {
      minimize: !isDevelopment,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            safari10: true,
          },
        }),
      ],
      splitChunks: {
        cacheGroups: {
          commons: {
            test: new RegExp(NODE_MODULES),
            chunks: 'all',
            name: 'lib',
          },
        },
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        minify: isDevelopment
          ? false
          : {
              collapseWhitespace: true,
            },
        favicon: getPath(`${PATH_ASSETS}/favicon.ico`),
        template: getPath(`${PATH_SRC}/index.html`),
      }),
      new webpack.DefinePlugin({
        'process.env': envData,
      }),
    ],
  };
};
