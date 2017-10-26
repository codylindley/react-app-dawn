// the path module provides utilities for working with file and directory paths.
const path = require('path');

// webpack
const webpack = require('webpack');

const version = require('./package.json').version;

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// requiring case senstive module plugin out of webpack (https://github.com/webpack/webpack/issues/2362)
const WarnCaseSensitiveModulesPlugin = require('webpack/lib/WarnCaseSensitiveModulesPlugin');

// ignore case warnings on OS that don't support file names with different casing
WarnCaseSensitiveModulesPlugin.prototype.apply = function ignoreCase() {};

/* It moves every require("style.css") in entry chunks into a separate css output file.
So your styles are no longer inlined into the javascript, but separate in a
css bundle file (styles.css). If your total stylesheet volume is big, it will be
faster because the stylesheet bundle is loaded in parallel to the javascript bundle.
https://github.com/webpack/extract-text-webpack-plugin */
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/* This is a webpack plugin that simplifies creation of HTML files to serve your
webpack bundles. This is especially useful for webpack bundles that include a hash
in the filename which changes every compilation.
https://github.com/ampedandwired/html-webpack-plugin */
const HtmlWebpackPlugin = require('html-webpack-plugin');

// favicon handling
// https://github.com/jantimon/favicons-webpack-plugin
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

/* This is the function that is called by webpack to return a webpack configuration object.
The env parameter is passed from the webpack cli e.g. webpack --env=production */
const finalWebpackConfig = (env) => {
    // set up webpack configuration object used for development
    const config = {
        devtool: 'eval',
        /* The Entry point(s) telling webpack where to start and follow the graph of
        dependencies to know what to bundle */
        entry: { // using two bundles or chunks
            // bundle third-party code in a file called bundle.thirdparty.[hash].js
            // babel polyfill is for IE 10 and under and other legacy browsers
            thirdparty: ['babel-polyfill'],
            index: './src/index.js' // bundle all non-thirdparty code in a file called bundle.index.[hash].js
        },
        // The webpack output property describes to webpack how to treat bundled code.
        output: {
            path: path.resolve(__dirname, 'build'),
            filename: `assets/js/bundle.[name].[hash].js?${version}`,
            // has to match webpack dev server path i.e. localhost:8080
            // required so that css loads url() and fonts in dev, removed for production
            publicPath: 'http://localhost:8080/'
        },
        devServer: {
            // --content-base is which directory is being served
            contentBase: path.resolve(__dirname, 'src'),
            /* When using the HTML5 History API,
            the index.html page will likely have be served in place of any 404 */
            historyApiFallback: true,
            // open in browser at localhost:8080
            hot: true
        },
        module: {
            /* Loaders tell webpack how to treat these (shown with test:) files as modules as
            they are added to your dependency graph. i.e. what to do with non-js files */
            rules: [
                { // WARNING this must remain the first object in the array
                    test: /\.css$/,
                    exclude: /node_modules/, // only use CSS modules and CSS next on our CSS
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1,
                                localIdentName: '[local]__[hash:base64:5]',
                                /* A CSS Module is a CSS file in which all class names and
                                animation names are scoped locally by default.
                                https://github.com/css-modules/css-modules */
                                modules: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                config: {
                                    path: './postcss.config.js'
                                }
                            }
                        }
                    ]
                },
                {
                    // Do not transform vendor's CSS with CSS-modules
                    // The point is that they remain in global scope.
                    // Since we require these CSS files in our JS or CSS files,
                    // they will be a part of our compilation either way.
                    // So, no need for ExtractTextPlugin here.
                    test: /\.css$/,
                    include: /node_modules/,
                    use: ['style-loader', 'css-loader']
                },
                {
                    test: /.*\.(gif|png|jpe?g|svg)$/i,
                    use: [
                        'file-loader?hash=sha512&digest=hex&name=assets/img/[hash].[ext]',
                        {
                            loader: 'image-webpack-loader',
                            query: {
                                mozjpeg: {
                                    progressive: true,
                                    quality: 65
                                },
                                gifsicle: {
                                    interlaced: false
                                },
                                optipng: {
                                    optimizationLevel: 7
                                },
                                pngquant: {
                                    quality: '75-90',
                                    speed: 4
                                }
                            }
                        }
                    ]
                },
                { test: /\.txt$/, use: 'raw-loader' },
                { test: /\.(mp4|webm)$/, use: 'url-loader?limit=10000' },
                { test: /\.json$/, use: 'json-loader' },
                { test: /.(woff(2)?|eot|ttf|svg)(\?[a-z0-9=.]+)?$/, use: 'file-loader?name=assets/fonts/[name].[ext]' },
                {
                    test: /\.(js$)/,
                    use: 'babel-loader',
                    include: path.join(__dirname, 'src')
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
            new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
            /* new FaviconsWebpackPlugin({
                logo: './src/common/images/favicon.png',
                title: 'Grasshopper',
                prefix: 'assets/img/icons/'
            }), */
            /* Use the HtmlWebpackPlugin plugin to make index.html a template so css and js can
            dynamically be added to the page. This will also take care of moving the index.html file
            to the build directory using the index.html in src as a template.
            https://github.com/ampedandwired/html-webpack-plugin
            */
            new HtmlWebpackPlugin({
                template: './src/index.html',
                inject: 'body',
                // https://github.com/kangax/html-minifier#options-quick-reference
                minify: env ? { // will minify html
                    removeComments: true,
                    collapseWhitespace: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    keepClosingSlash: true,
                    minifyURLs: true
                } : false
            }),
            // Extract the CSS into a separate file
            new ExtractTextPlugin('assets/css/[name].[hash].css'),
            /* The CommonsChunkPlugin can move modules that occur in multiple entry chunks
            to a new entry chunk (the commons chunk). */
            new webpack.optimize.CommonsChunkPlugin({
                names: ['thirdparty']
            }),
            new webpack.DefinePlugin({
                VERSION: JSON.stringify(version),
                ENV: env ? JSON.stringify(env) : JSON.stringify('dev')
            })
        ]
    };

    // augment the webpack config object used for development so it can be used for production
    if (env === 'production') {
        // add devtool for production, for dev it is handled with cli flag: -d
        config.devtool = 'source-map';
        // remove local dev server path for production
        config.output.publicPath = '/';
        // different CSS loading for production
        config.module.rules.shift();// remove the first rule, replace with next rule below
        config.module.rules.push({// add a new rule for CSS for production
            test: /\.css$/,
            exclude: /node_modules/, // only use CSS modules and CSS next on our CSS
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                /* A CSS Module is a CSS file in which all class names and
                animation names are scoped locally by default. Note that minimize uses cssnano
                https://github.com/css-modules/css-modules */
                use: 'css-loader?modules&minimize&importLoaders=1&localIdentName=[path]__[local]__[hash:base64:3]!postcss-loader'
            })
        });
        // get rid of various test helpers, tell Webpack to use the production node environment.
        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production')
                }
            })
        );

        // saves a couple of kBs
        config.plugins.push(
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false,
                quiet: true
            })
        );
        // Minify and optimize the JavaScript bundle
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    screw_ie8: true,
                    drop_console: true,
                    // do not show warnings in the console (there is a lot of them)
                    warnings: false,
                    unused: true,
                    dead_code: true
                },
                mangle: {
                    screw_ie8: true
                },
                output: {
                    comments: false,
                    ascii_only: true,
                    screw_ie8: true
                },
                comments: false,
                sourceMap: true
            })
        );
        // A plugin for a more aggressive chunk merging strategy.
        config.plugins.push(
            new webpack.optimize.AggressiveMergingPlugin()
        );
        /* only use if you want to see a visual mapping of the modules.
        //
        config.plugins.push(
            new BundleAnalyzerPlugin()
        );
        */
    }

    // have this function return an webpack config object
    return config;
};

module.exports = finalWebpackConfig;
