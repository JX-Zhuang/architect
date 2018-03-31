module.exports = {
    entry: ['./src/index.js','./src/index2.js'],
    output: {
        filename: '[name].js',
        path: __dirname + '/dist'
    }
};