const webpack = require('webpack');

module.exports = function override(config, env) {
    //do stuff with the webpack config...

    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
        }),
    ]);

    config.resolve.fallback = {
        url: require.resolve('url'),
        assert: require.resolve('assert'),
        crypto: require.resolve('crypto-browserify'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        buffer: require.resolve('buffer/'),
        stream: require.resolve('stream-browserify'),
        vm: require.resolve("vm-browserify"),
        process: require.resolve('process/browser')
    };

    config.resolve.alias = {
        ...config.resolve.alias,
        'process/browser': require.resolve('process/browser.js'),
    };

    // Paquetes ESM (.mjs) como pdfjs-dist (usado por react-pdf) hacen imports
    // sin extensión (p. ej. "process/browser"); webpack 5 exige extensión
    // explícita en módulos ESM "fully specified". Se desactiva esa exigencia
    // para .mjs en node_modules.
    config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        resolve: {
            fullySpecified: false,
        },
    });

    config.ignoreWarnings = [
        {
            file: /node_modules\/.*\.scss$/
        }
    ];

    return config;
}