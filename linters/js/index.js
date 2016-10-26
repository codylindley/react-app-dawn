module.exports = {
    extends: [
        './best-practices.js',
        './errors.js',
        './node.js',
        './style.js',
        './variables.js',
        './es6.js',
        './imports.js'
    ].map(require.resolve),
    parserOptions: {
        ecmaVersion: 2017,
        sourceType: 'module',
        ecmaFeatures: {
            experimentalObjectRestSpread: true
        }
    },
    rules: {
        strict: 'error'
    }
};
