const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const glob = require("glob");

/**
 * NOT IN USE - MAY BE USEFUL IF A SINGLE .js BUNDLE IS NEEDED
 * Command example: "build:bundle": "webpack --config webpack.config.js"
 */

module.exports = {
  entry: {
    "bundle.js": glob
      .sync("build/static/?(js|css)/main.*.?(js|css)")
      .map((f) => path.resolve(__dirname, f)),
  },
  output: {
    filename: "../build/static/js/bundle.min.js",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [new UglifyJsPlugin()],
};
