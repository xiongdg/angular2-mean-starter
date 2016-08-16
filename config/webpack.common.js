const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');

// plugins
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DedupePlugin = webpack.optimize.DedupePlugin;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OccurenceOrderPlugin = webpack.optimize.OccurenceOrderPlugin;

module.exports = {
    target: 'web',
    cache: true,
    debug: false,

    module: {
        loaders: [
            {
                test: /\.ts$/,
                exclude: [path.resolve(__dirname, '../node_modules')],
                loader: 'ts'
            },
            {
                test: /\.pug$/,
                loader: 'pug-html-loader'
            },
            {
                test: /\.styl$/,
                include: [path.resolve(__dirname, '../src/client')],
                loader: 'raw!postcss-loader!stylus-loader'
            },
            {
                test: /\.styl$/,
                exclude: [path.resolve(__dirname, '../src/client')],
                include: [path.resolve(__dirname, '../src/styles')],
                loader: ExtractTextPlugin.extract('raw!postcss-loader!stylus-loader')
            }
        ]
    },

    stats: {
        cached: true,
        cachedAssets: true,
        chunks: true,
        chunkModules: false,
        colors: true,
        hash: false,
        reasons: false,
        timings: true,
        version: false
    },

    entry: {
        'assets/js/client.js': './src/client',
        'assets/js/vendor.js': './src/vendor',
        'assets/js/polyfills.js': './src/polyfills'
    },

    postcss: [
        autoprefixer({ browsers: ['last 3 versions', 'Firefox ESR'] })
    ],

    plugins: [
        new ExtractTextPlugin('assets/css/[contenthash:16].css'),
        new DedupePlugin(),
        new OccurenceOrderPlugin(),
        new CommonsChunkPlugin({
            name: [
                'assets/js/client.js',
                'assets/js/vendor.js',
                'assets/js/polyfills.js'
            ]
        }),
        new CopyWebpackPlugin([
            {
                from: 'src/images',
                to: 'assets/images'
            },
            {
                from: 'src/favicon.ico',
                to: 'favicon.ico'
            }
        ]),
        new HtmlWebpackPlugin({
            chunksSortMode: 'none',
            filename: 'index.html',
            hash: true,
            inject: 'body',
            template: './src/index.pug'
        })
    ],

    resolve: {
        extensions: ['', '.ts', '.js', '.json'],
        modulesDirectories: ['node_modules'],
        root: path.resolve('../src')
    },

    output: {
        filename: '[name]',
        path: path.resolve(__dirname, '../target'),
        publicPath: '/'
    },

    node: {
        net: false,
        fs: false,
        crypto: 'empty',
        module: false,
        clearImmediate: false,
        setImmediate: false
    }
};
