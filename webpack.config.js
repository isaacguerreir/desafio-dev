const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
    entry: './src/main.js',
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            // this will apply to both plain `.js` files
            // AND `<script>` blocks in `.vue` files
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.s(c|a)ss$/,
                use: [
                  'vue-style-loader',
                  'css-loader',
                  {
                    loader: 'sass-loader',
                    // Requires sass-loader@^7.0.0
                    options: {
                      implementation: require('sass'),
                      indentedSyntax: true // optional
                    },
                    // Requires >= sass-loader@^8.0.0
                    options: {
                      implementation: require('sass'),
                      sassOptions: {
                        indentedSyntax: true // optional
                      },
                    },
                  },
                ],
            }
        ]
    },
    plugins: [
        // make sure to include the plugin for the magic
        new VueLoaderPlugin()
    ],
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle.js"
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        hot: true
    }
};