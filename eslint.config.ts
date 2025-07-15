import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import unicorn from 'eslint-plugin-unicorn';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'node_modules',
      '.cache',
      './src/mocks/**/*.ts',
      '*.test.{ts,tsx}',
      './src/components/ui/**',
    ],
  },
  eslintConfigPrettier,
  {
    extends: [...tseslint.configs.strictTypeChecked],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: [
          './tsconfig.app.json',
          './tsconfig.node.json',
          './tsconfig.test.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      unicorn,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/restrict-template-expressions': [
        'warn',
        {
          allowNumber: true,
          allowBoolean: false,
          allowNullish: false,
        },
      ],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'never' },
      ],
      '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/array-type': ['warn', { default: 'array-simple' }],
      '@typescript-eslint/member-ordering': 'warn',
      'unicorn/prevent-abbreviations': [
        'error',
        {
          replacements: {
            addr: { address: true },
            addrEdits: { addressEdits: true },
            addrErrors: { addressErrors: true },
            dob: { dateOfBirth: true },
            idx: { index: true },
            err: { error: true },
            val: { value: true },
            ctx: { context: true },
            req: { request: true },
            res: { response: true },
            cb: { callback: true },
            obj: { object: true },
            str: { string: true },
            msg: { message: true },
            fn: { function: true },
            el: { element: true },
            btn: { button: true },
            txt: { text: true },
            img: { image: true },
            d: { data: true },
            arr: { array: true },
            temp: { temporary: true },
            ref: { reference: true },
            e: { event: true },
          },
          extendDefaultReplacements: true,
          checkFilenames: false,
          checkProperties: false,
        },
      ],
    },
  },
);
