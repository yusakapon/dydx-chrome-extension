const { defineConfig } = require("@vue/cli-service");
const webpack = require("webpack");
module.exports = defineConfig({
  transpileDependencies: true,
  filenameHashing: false,
  productionSourceMap: false,
  configureWebpack: {
    watch: true,
    watchOptions: {
      ignored: ['dist/manifest.json', 'dist/loader.js', 'dist/index.html'],
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      }),
      new webpack.ProvidePlugin({
        process: "process/browser",
      }),
    ],
    resolve: {
      fallback: {
        fs: false,
        buffer: require.resolve("buffer"),
        crypto: require.resolve("crypto-browserify"),
        url: require.resolve("url/"),
        os: require.resolve("os-browserify/browser"),
        https: require.resolve("https-browserify"),
        http: require.resolve("stream-http"),
        assert: require.resolve("assert/"),
        path: require.resolve("path-browserify"),
        stream: require.resolve("stream-browserify"),
      },
    },
  },
});
