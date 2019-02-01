const path = require("path");
const webpack = require("webpack");

const plugins =
  process.env.NODE_ENV === "production"
    ? [new webpack.optimize.UglifyJsPlugin()]
    : [];

module.exports = {
  entry: "./html/assets/scripts/main.js",
  output: {
    filename: "main.bundle.js",
    path: path.resolve(__dirname, "html/assets/scripts/")
  },
  mode: "development",

  devtool: "eval-source-map",

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  plugins: plugins
};
