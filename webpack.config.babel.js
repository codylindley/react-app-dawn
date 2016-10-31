
// the path module provides utilities for working with file and directory paths.
const path = require('path');

// webpack
const webpack = require('webpack');

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

/* add :focus selector to every :hover for keyboard accessibility
https://github.com/postcss/postcss-focus */
const postcssFocus = require('postcss-focus');

/* A PostCSS plugin to console.log() the messages (warnings, etc.) registered
by other PostCSS plugins.
https://github.com/postcss/postcss-reporter */
const postcssReporter = require('postcss-reporter');

/* This is a webpack plugin that simplifies creation of HTML files to serve your
webpack bundles. This is especially useful for webpack bundles that include a hash
in the filename which changes every compilation.
https://github.com/ampedandwired/html-webpack-plugin */
const HtmlWebpackPlugin = require('html-webpack-plugin')

/* This is the function that is called by webpack to return a webpack configuration object.
The env parameter is passed from the webpack cli e.g. webpack --env=production */
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
            rules: [
                { // WARNING this must remain the first object in the array
                    test: /\.css$/,
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
                                modules: true,
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'postcss-loader'
                        }
                    ]
                },
                {
                    test: /.*\.(gif|png|jpe?g|svg)$/i,
                    loaders: [
                        'file?hash=sha512&digest=hex&name=[hash].[ext]',
                        'image-webpack?{optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}, mozjpeg: {quality: 65}}'
                    ]
                },
                { test: /\.txt$/, loader: 'raw-loader' },
                { test: /\.(mp4|webm)$/, loader: 'url-loader?limit=10000' },
                { test: /\.json$/, loader: 'json-loader' },
                { test: /.(woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/, loader: 'file-loader' },
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
            new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
            // need comment
            new webpack.LoaderOptionsPlugin({
                options: {
                    context: __dirname,
                    postcss: [
                        cssnext({
                            // Allow future CSS features to be used, also auto-prefixes the CSS...
                            browsers: ['last 2 versions', 'IE > 10']
                        }),
                        postcssFocus(),
                        postcssReporter()

                    ]
                }
            }),
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
        config.module.rules.shift();// remove the first rule
        config.module.rules.push({// add a new rule for CSS for production
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({
                fallbackLoader: 'style-loader',
                /* A CSS Module is a CSS file in which all class names and
                animation names are scoped locally by default. Note that minimize uses cssnano
                https://github.com/css-modules/css-modules */
                loader: 'css-loader?modules&minimize&importLoaders=1&localIdentName=[path]__[local]__[hash:base64:3]!postcss-loader'
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

        // Merge all duplicate modules
        config.plugins.push(
            new webpack.optimize.DedupePlugin()
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
                    // do not show warnings in the console (there is a lot of them)
                    warnings: false
                }
            })
        );
        // A plugin for a more aggressive chunk merging strategy.
        config.plugins.push(
            new webpack.optimize.AggressiveMergingPlugin()
        );
    }

    // have this function return an webpack config object
    return config;
};

module.exports = finalWebpackConfig;
