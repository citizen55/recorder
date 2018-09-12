const path = require('path');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devServer: {
        https: true
    },
    entry: { main: './src/app.js' },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bandle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.worker\.js$/,
                use: {
                    loader: "worker-loader" ,
                    options: { inline: true }
                }
            }
        ]
    },
    watch: true,
    plugins: [
        new BrowserSyncPlugin({
            host: process.env.IP || 'localhost',
            port: process.env.PORT || 3000,
            server: {
                baseDir: ['./', './build']
            }
        }),
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            template: './src/index.html',
            filename: '../index.html'
        })
    ]
}