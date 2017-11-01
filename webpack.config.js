var path = require('path');

module.exports = {
    entry: './src/Preyon2',
    output: {
        path: path.resolve(__dirname, 'dist/umd'),
        libraryTarget: 'umd',
        library: 'Preyon2'
    }
};