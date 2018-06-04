const path = require("path");
const webpack = require("webpack");
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    entry: ['./src/js/focusmove.js'],
    output: {
        path: path.resolve(__dirname, "./dist"),
        filename: "focusmove.js",
        publicPath: "/dist/",
        library: "FocusMove",
        libraryTarget: "umd",
    },
    watchOptions: {
        poll: 1000, //监测修改的时间(ms)
        ignored: /node_modules/, //不监测
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
        // new webpack.HotModuleReplacementPlugin(),
        //  new webpack.NoEmitOnErrorsPlugin() 
    ],
    mode: "development"
}