const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.jsx',
    resolve: {extensions: ['.js', '.jsx']},
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {presets: [['@babel/preset-env', {targets: 'defaults'}], ['@babel/preset-react', {runtime: 'classic'}]]},
            },
        }],
    },
    // Mattermost exposes its own React and Redux on window; plugins must share them.
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'react-redux': 'ReactRedux',
    },
    // Mattermost loads a single bundle file, so inline mermaid's lazy diagram chunks.
    plugins: [new webpack.optimize.LimitChunkCountPlugin({maxChunks: 1})],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'main.js',
    },
    performance: {hints: false},
};
