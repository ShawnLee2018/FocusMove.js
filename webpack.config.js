const path = require("path");
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    entry: ['./src/js/focusmove.js'],
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "focusmove.js",
        publicPath: "/dist/",
        library: "focusmove",
        libraryTarget: "umd",
    },
    target: "web",
    module: {
        rules: [
            {
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
    ]
}