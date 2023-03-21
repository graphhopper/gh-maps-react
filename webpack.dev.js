const { mergeWithRules, CustomizeRule } = require('webpack-merge')
const path = require('path')

const common = require('./webpack.common.js')

const develop = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
        static: path.resolve(__dirname, 'dist'),
        https: false,
        port: 3000,
        host: '0.0.0.0',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                exclude: path.resolve(__dirname, 'node_modules'),
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                auto: (resourcePath) => resourcePath.endsWith(".module.css"),
                                localIdentName: '[path][name]__[local]',
                            },
                        },
                    },
                ],
            },
        ],
    },
}

const mergePattern = {
    module: {
        rules: {
            test: CustomizeRule.Match,
            exclude: CustomizeRule.Match,
            use: {
                loader: CustomizeRule.Match,
                options: CustomizeRule.Replace,
            },
        },
    },
}

module.exports = mergeWithRules(mergePattern)(common, develop)
