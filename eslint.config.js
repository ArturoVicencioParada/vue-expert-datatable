import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
        plugins: { js },
        extends: ['js/recommended'] 
    },
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
        languageOptions: { globals: globals.browser } 
    },
    tseslint.configs.recommended,
    pluginVue.configs['flat/recommended'],
    prettier,
    { 
        files: ['**/*.vue'], 
        languageOptions: { 
            parserOptions: { 
                parser: tseslint.parser 
            } 
        },
        rules: {
            'quotes': ['error', 'single'],
            'indent': ['error', 4],
            'vue/html-indent': ['error', 4],
            'vue/script-indent': ['error', 4],
            'vue/html-closing-bracket-newline': [
                'error',
                {
                    'singleline': 'never',
                    'multiline': 'always'
                }
            ],
            'vue/max-attributes-per-line': [
                'error',
                {
                    'singleline': 3,
                    'multiline': 1
                }
            ],
            'vue/first-attribute-linebreak': [
                'error',
                {
                    'singleline': 'ignore',
                    'multiline': 'below'
                }
            ],
            'vue/multiline-html-element-content-newline': [
                'error',
                {
                    'ignoreWhenEmpty': true,
                    'allowEmptyLines': false
                }
            ],
            'vue/max-len': [
                'error',
                {
                    'code': 120,
                    'template': 120,
                    'tabWidth': 4,
                    'ignoreUrls': true,
                    'ignoreStrings': true,
                    'ignoreTemplateLiterals': true
                }
            ],
            'max-len': [
                'error',
                { 
                    'code': 120,
                    'ignoreUrls': true,
                    'ignoreStrings': true,
                    'ignoreTemplateLiterals': true,
                    'ignoreRegExpLiterals': true
                }
            ],
            'function-paren-newline': ['error', 'multiline-arguments'],
            'function-call-argument-newline': ['error', 'consistent'],
            'object-property-newline': [
                'error',
                {
                    'allowAllPropertiesOnSameLine': false
                }
            ],
            'object-curly-newline': [
                'error',
                {
                    'multiline': true,
                    'consistent': true
                }
            ],
            'array-bracket-newline': [
                'error',
                {
                    'multiline': true
                }
            ],
            'array-element-newline': [
                'error',
                {
                    'multiline': true,
                    'minItems': 3
                }
            ],
            'operator-linebreak': ['error', 'before'],
            'implicit-arrow-linebreak': ['error', 'beside'],
            'arrow-parens': ['error', 'always'],
            'arrow-spacing': [
                'error',
                {
                    'before': true,
                    'after': true
                }
            ]
        }
    },
    {
        files: ['**/*.{js,ts}'],
        rules: {
            'quotes': ['error', 'single'],
            'indent': ['error', 4],
            'max-len': [
                'error',
                { 
                    'code': 120,
                    'ignoreUrls': true,
                    'ignoreStrings': true,
                    'ignoreTemplateLiterals': true,
                    'ignoreRegExpLiterals': true
                }
            ],
            'function-paren-newline': ['error', 'multiline-arguments'],
            'function-call-argument-newline': ['error', 'consistent'],
            'object-property-newline': [
                'error',
                {
                    'allowAllPropertiesOnSameLine': false
                }
            ],
            'object-curly-newline': [
                'error',
                {
                    'multiline': true,
                    'consistent': true
                }
            ],
            'array-bracket-newline': [
                'error',
                {
                    'multiline': true
                }
            ],
            'array-element-newline': [
                'error',
                {
                    'multiline': true,
                    'minItems': 3
                }
            ],
            'operator-linebreak': ['error', 'before'],
            'implicit-arrow-linebreak': ['error', 'beside'],
            'arrow-parens': ['error', 'always'],
            'arrow-spacing': [
                'error',
                {
                    'before': true,
                    'after': true
                }
            ]
        }
    }
]);
