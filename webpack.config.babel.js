const path = require('path');
const webpack = require('webpack');
const webpackValidator = require('webpack-validator');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const cssnext = require('postcss-cssnext');

module.exports = () => {
    const config = webpackValidator({
        entry: ['./src/index.js'],
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'bundle.js'
        },
        module: {
            loaders: [
                { test: /\.png$/, loader: "url-loader?limit=100000", exclude: /node_modules/ },
                { test: /\.jpg$/, loader: "file-loader", exclude: /node_modules/ },
                { test: /\.jpeg$/, loader: "file-loader", exclude: /node_modules/ },
                { test: /\.gif$/, loader: "file-loader", exclude: /node_modules/ },
                { test: /\.txt$/, loader: "raw-loader", exclude: /node_modules/ },
                { test: /\.json$/, loader: "json-loader", exclude: /node_modules/ },
                { test: /.(woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/, loader: 'url-loader?limit=100000' },
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    loader: ExtractTextPlugin.extract({
                        fallbackLoader: 'style-loader',
                        loader: 'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]___[hash:base64:5]!postcss-loader'
                    })
                },
                { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/, query: { presets: ['latest', 'react', 'stage-0'] } },
            ]
        },
        plugins: [
            new ExtractTextPlugin('styles.css'),
            new webpack.LoaderOptionsPlugin({
                options: {
                    context: __dirname,
                    postcss: [
                        cssnext({ // Allow future CSS features to be used, also auto-prefixes the CSS...
                            browsers: ['last 2 versions', 'IE > 10'], // ...based on this browser list
                        }),
                    ]
                },
            })
        ]
    });
    return config
};