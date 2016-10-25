const path = require('path');
const webpack = require('webpack');
const webpackValidator = require('webpack-validator');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const cssnext = require('postcss-cssnext');

//this is the function that is called by webpack to return a webpack configuration object
//the env parameter is passed from the webpack cli e.g. webpack --color -p --env=production
const finalWebpackConfig = (env) => {

    //set up webpack configuration object used for development
    const config = {
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
    };

    //augment the webpack config object used for development so it can be used for production
    if (env === 'production') {

        /*get rid of various test helpers, tell Webpack to use the production node environment.*/
        config.plugins.push(
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            })
        );

        // Merge all duplicate modules
        config.plugins.push(
            new webpack.optimize.DedupePlugin(),
        );

        // Minify and optimize the JavaScript
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false, // ...but do not show warnings in the console (there is a lot of them)
                },
            })
        );

    }

    //have this function return an webpack config object that is webpack validated 
    return webpackValidator(config);
};

module.exports = finalWebpackConfig;