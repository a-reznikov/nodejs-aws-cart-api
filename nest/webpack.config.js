const nodeExternals = require('webpack-node-externals');
const path = require('path');

const lazyImports = [
  "@nestjs/microservices/microservices-module",
  "@nestjs/websockets/socket-module",
];

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: ['./src/lambda.ts'],
    target: 'node',
    externals: [nodeExternals()],

    output: {
      ...options.output,
      filename: 'lambda.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
        type: 'commonjs2'
      }
    },

    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          return lazyImports.includes(resource);
        },
      }),
    ],

    mode: 'production',
    optimization: {
      minimize: true
    }
  };
};