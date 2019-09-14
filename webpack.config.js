var webpack = require('webpack');
var path = require('path');
var config = {};

function generateConfig(name) {
    var uglify = name.indexOf('min') > -1;
    var config = {
        entry: './index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: name + '.js',
            sourceMapFilename: name + '.map',
            library: 'FullHelp',
            libraryTarget: 'umd'
        },
        node: {
            process: false
        },
        devtool: 'source-map'
    };

    config.optimization = {
        minimize: uglify
    }

    return config;
}

['contactjs', 'contactjs.min'].forEach(function (key) {
    config[key] = generateConfig(key);
});

module.exports = config;