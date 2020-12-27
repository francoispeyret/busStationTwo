const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    devServer: {
        contentBase: path.join(__dirname, '../'),
        compress: true,
        port: 9000
    },

    module: {
        rules: [
            {
                test: [/.js$/],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env'
                        ],
                        plugins: [
                            "@babel/plugin-proposal-class-properties",
                        ]
                    }
                }
            }
        ]
    },
}
