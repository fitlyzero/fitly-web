import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      // These two react-hooks rules target React Compiler-era patterns and
      // currently flag several pre-existing, intentional effect usages in
      // this codebase (e.g. resetting local UI state when a section/record
      // changes). Keep them as warnings until those call sites are reviewed
      // and migrated deliberately, instead of blocking CI on day one.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/refs': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      // Ternary/short-circuit expressions used purely for their side effect
      // (e.g. `isOpen ? set.delete(k) : set.add(k)`) are an existing, working
      // idiom in this codebase; only flag genuinely unused expressions.
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true, allowTernary: true },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
);
