module.exports = {
    parser: 'babel-eslint',
    extends: ['airbnb-base', 'prettier'],
    "env": {
        "browser": true,
    },
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        'max-len': ['error', 120],
        'no-bitwise': 'off',
        'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
        'no-mixed-operators': 'off',
        'no-await-in-loop': 'off',
        'func-names': ['error', 'never'],
        'no-underscore-dangle': 'off',
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],
        'no-param-reassign': 'off',
        'class-methods-use-this': 'off',
        'no-shadow': 'off',
        'consistent-return': 'off',
        'spaced-comment': ['error', 'always'],
        'default-case': 'off',
        'no-lonely-if': 'off',
        'prefer-destructuring': 'off'
    },
};
