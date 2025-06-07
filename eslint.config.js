import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

/** @type { import('eslint').Linter.Config[] } */
export default [
    {
        files: ['src/**/*.{ts,tsx}'],
        ignores: ['node_modules/', 'main.js'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                sourceType: 'module',
                project: './tsconfig.json',
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            tsPlugin,
        },
        rules: {
            ...tsPlugin.configs['eslint-recommended'].rules,
            ...tsPlugin.configs['recommended'].rules,
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    "args": "none"
                }
            ],
            "@typescript-eslint/ban-ts-comment": "off",
            "no-prototype-builtins": "off",
            "@typescript-eslint/no-empty-function": "off",
            "@typescript-eslint/no-floating-promises": "error"
        },
    },
]
