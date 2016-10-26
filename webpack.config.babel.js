
// the path module provides utilities for working with file and directory paths.
const path = require('path');

// webpack
const webpack = require('webpack');

/* This package provides a joi object schema for webpack configs.
This gets you a) static type safety, b) property spell checking and c) semantic validations such as
"loader and loaders can not be used simultaneously" or "query can only be used
with loader, not with loaders".
https://github.com/js-dxtools/webpack-validator
*/
const webpackValidator = require('webpack-validator');

/* It moves every require("style.css") in entry chunks into a separate css output file.
So your styles are no longer inlined into the javascript, but separate in a
css bundle file (styles.css). If your total stylesheet volume is big, it will be
faster because the stylesheet bundle is loaded in parallel to the javascript bundle.
https://github.com/webpack/extract-text-webpack-plugin */
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/* PostCSS-cssnext is a PostCSS plugin that helps you to use the latest CSS syntax today.
It transforms CSS specs into more compatible CSS so you don’t need to wait for
browser support.
https://github.com/MoOx/postcss-cssnext
*/
const cssnext = require('postcss-cssnext');

/* This is a webpack plugin that simplifies creation of HTML files to serve your
webpack bundles. This is especially useful for webpack bundles that include a hash
in the filename which changes every compilation.
https://github.com/ampedandwired/html-webpack-plugin */
const HtmlWebpackPlugin = require('html-webpack-plugin')

/* This is the function that is called by webpack to return a webpack configuration object.
The env parameter is passed from the webpack cli e.g. webpack --color -p --env=production */
const finalWebpackConfig = (env) => {
    // set up webpack configuration object used for development
    const config = {
        /* The Entry point(s) telling webpack where to start and follow the graph of 
        dependencies to know what to bundle */
        entry: { // using two bundles or chunks
            thirdparty: ['react', 'react-dom'], // bundle thridparty code in a file called bundle.thirdparty.[hash].js
            index: './src/index.js' // bundle all non-thridparty code in a file called bundle.index.[hash].js
        },
        // The webpack output property describes to webpack how to treat bundled code.
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: 'bundle.[name].[hash].js'
        },
        module: {
            /* Loaders tell webpack how to treat these (shown with test:) files as modules as
            they are added to your dependency graph. i.e. what to do with non-js files */
            loaders: [
                { test: /\.png$/, loader: 'url-loader?limit=100000', exclude: /node_modules/ },
                { test: /\.jpg$/, loader: 'file-loader', exclude: /node_modules/ },
                { test: /\.jpeg$/, loader: 'file-loader', exclude: /node_modules/ },
                { test: /\.gif$/, loader: 'file-loader', exclude: /node_modules/ },
                { test: /\.txt$/, loader: 'raw-loader', exclude: /node_modules/ },
                { test: /\.json$/, loader: 'json-loader', exclude: /node_modules/ },
                { test: /.(woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/, loader: 'url-loader?limit=100000' },
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    loader: ExtractTextPlugin.extract({
                        fallbackLoader: 'style-loader',
                        loader: 'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[local]___[hash:base64:5]!postcss-loader'
                    })
                },
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: ['latest', 'react', 'stage-0']
                    }
                }
            ]
        },

        /* Since Loaders only execute transforms on a per-file basis, Plugins are most commonly
        used (but not limited to) performing actions and custom functionality on "compilations"
        or "chunks" of your bundled modules (and so much more).

        In order to use a plugin, you just need to require() it and add it to the plugins array.
        Since most plugins are customizable via options, you need to create an instance
        of it by calling it with new.*/
        plugins: [
            // need comment
            new webpack.LoaderOptionsPlugin({
                options: {
                    context: __dirname,
                    postcss: [
                        cssnext({
                            // Allow future CSS features to be used, also auto-prefixes the CSS...
                            browsers: ['last 2 versions', 'IE > 10']
                        })
                    ]
                }
            }),
            /* Use the HtmlWebpackPlugin plugin to make index.html a template so css and js can
            dynamically be added to the page. */
            new HtmlWebpackPlugin({
                template: './src/index.html',
                inject: 'body'
            }),
            // Extract the CSS into a separate file
            new ExtractTextPlugin('[name].[hash].css'),
            /* The CommonsChunkPlugin can move modules that occur in multiple entry chunks
            to a new entry chunk (the commons chunk). */
            new webpack.optimize.CommonsChunkPlugin({
                names: ['thirdparty']
            })
        ]
    };

    // augment the webpack config object used for development so it can be used for production
    if (env === 'production') {
        // get rid of various test helpers, tell Webpack to use the production node environment.
        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            })
        );

        // Merge all duplicate modules
        config.plugins.push(
            new webpack.optimize.DedupePlugin(),
        );

        // Minify and optimize the JavaScript bundle
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    // ...but do not show warnings in the console (there is a lot of them)
                    warnings: false
                }
            })
        );
    }

    // have this function return an webpack config object that is webpack validated
    return webpackValidator(config);
};

module.exports = finalWebpackConfig;
