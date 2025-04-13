const lazyImports = [
  "@nestjs/microservices/microservices-module",
  "@nestjs/websockets/socket-module",
];

module.exports = function (options, webpack) {
  return {
    ...options,
    entry: ['./src/main.ts'],
    externals: [],
    output: {
      ...options.output,
      filename: 'main.js',
      libraryTarget: 'commonjs2',
    },
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          return lazyImports.includes(resource);
        },
      }),
    ],
  };
};