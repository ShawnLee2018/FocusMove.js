const path = require("path");
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const version = require('./package.json').version;
module.exports = {
    entry: ['./src/js/focusmove.js'],
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "focusmove.js",
        publicPath: "/dist/",
        library: "FocusMove",
        libraryTarget: "umd",
    },
    target: "web",
    module: {
        rules: [{
                test: /\.js?$/,
                include: [
                    path.resolve(__dirname, "src")
                ],
                exclude: path.resolve(__dirname, 'node_modules'),
                loader: "babel-loader",
                options: {
                    presets: ["env"]
                },
            },

        ],

    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.BannerPlugin(`/** @license MIT v${version} (c) 2018 Shawn Lee. Home: https://github.com/ShawnLee2018/FocusMove.js */`)
    ]
}