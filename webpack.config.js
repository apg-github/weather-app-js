const path = require("path");
const autoprefixer = require("autoprefixer");
//const entryPath = "app";
const entryFile = "app.js";

module.exports = {
  entry: `./js/${entryFile}`,
  output: {
    filename: "out.js",
    path: path.resolve(__dirname, `/build`)
  },
  devServer: {
    contentBase: __dirname,
    publicPath: "/build/",
    compress: true,
    port: 3004
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [autoprefixer()]
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.(jpe?g|gif|png|svg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          publicPath: "/images/",
          outputPath: "/images/"
        }
      }
    ]
  }
};
