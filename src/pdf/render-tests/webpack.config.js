const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "./build/pdf/render-tests/testEntry.js"),
  output: {
    path: path.resolve(__dirname, "bundle"),
    filename: "bundle.js",
    publicPath: "",
  },
};
