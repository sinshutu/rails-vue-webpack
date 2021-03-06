const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')

const env = process.env.NODE_ENV || 'development';
const fileName = (env == 'development') ? '[name]' : '[name]-[hash]';

module.exports = {
    // 起点となるディレクトリ
    context: path.join(__dirname, './assets'),

    // ビルド対象となるファイル
    entry: {
        application: './javascripts/main.js',
    },

    // ビルド先のファイル
    output: {
        path: path.join(__dirname, '../public/assets/'),
        filename: `${fileName}.js`,
        publicPath: '/assets/',
    },
    plugins: [
        // CSSを切り出す
        new ExtractTextPlugin.extract({
            fallbackLoader: 'style-loader',
            loader: [{loader: 'css-loader', options: {module: true}}],
        }),

        // JavaScript/CSS変更時に自動でリロードする
        new webpack.HotModuleReplacementPlugin(),

        // 本番環境のキャッシュ対策としてハッシュ値を生成する
        new ManifestPlugin({
            fileName: 'webpack.manifest.json'
        })
    ],
    module: {
        rules: [
            // eslint
            {
                test: /\.js$/,
                enforce: 'pre',
                loader: 'eslint-loader',
                include: './javascripts',
                exclude: /node_modules/,
            },
            // vue
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                    }
                }
            },
            // JavaScriptをBabelでトランスパイルする
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            // SCSS/CSSを別ファイルに切り出す
            {
                test: /\.s?css$/,
                loader: 'style-loader!css-loader!sass-loader',
                exclude: /node_modules/
            },
            // 画像を別ファイルに切り出す
            {
                test: /\.(png|jpg|gif|svg|ttf)$/,
                loader: 'file-loader',
                options: {
                    name: `${fileName}.[ext]`
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.css', '.scss']
    },
    devServer: {
        host: "0.0.0.0",
        port: 8080,
        inline: true,
        hot: true,
        noInfo: false
    }
};
