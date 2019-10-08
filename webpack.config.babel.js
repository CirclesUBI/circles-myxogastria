import path from 'path';

import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

const NODE_MODULES = 'node_modules';
const PATH_ASSETS = './assets';
const PATH_DIST = './build';
const PATH_SRC = './src';

function getPath(filePath) {
  return path.resolve(__dirname, filePath);
}

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
      path: getPath(PATH_DIST),
      publicPath: '/',
    },
    resolve: {
      modules: [NODE_MODULES],
      alias: {
        '~': getPath(PATH_SRC),
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude,
          use: [
            'babel-loader',
            'eslint-loader',
            'stylelint-custom-processor-loader',
          ],
        },
        {
          test: /\.(png|jp(e?)g|gif)$/,
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
    devtool: isDevelopment ? 'source-map' : undefined,
    devServer: {
      clientLogLevel: 'silent',
      contentBase: getPath(PATH_DIST),
      historyApiFallback: true,
      liveReload: false,
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
        'process.env': Object.keys(require('./config/production.js')).reduce(
          (acc, key) => {
            // Check for missing config variables
            if (!process.env[key]) {
              throw new Error(`${key} not set for ${process.env.NODE_ENV}!`);
            }

            // Pass values over to app from given environment
            acc[key] = JSON.stringify(process.env[key]);

            return acc;
          },
          {},
        ),
      }),
    ],
  };
};
