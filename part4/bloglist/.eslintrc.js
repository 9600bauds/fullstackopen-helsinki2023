module.exports = {
    env: {
        node: true,
        commonjs: true,
        es2021: true,
        jest: true,
    },
    extends: 'eslint:recommended',
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        indent: ['error', 4],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        eqeqeq: 'error',
        'no-trailing-spaces': 'off',
        'object-curly-spacing': ['error', 'always'],
        'arrow-spacing': ['error', { before: true, after: true }],
        'no-console': 0,
    },
};
