"use strict";

const jest = require("eslint-plugin-jest");

// Every element is scoped to test files. eslint-plugin-jest's flat configs
// carry no `files` of their own, so spreading them unscoped would apply Jest
// globals and rules to production code, where a stray `describe(` or `expect(`
// should still be reported by no-undef.
const files = ["**/*.{test,spec}.{js,mjs,cjs}", "**/__tests__/**/*.{js,mjs,cjs}"];

/**
 * eslint configuration for jest.
 * @type { import('eslint').Linter.Config[] } config
 */
module.exports = [
  {
    files,
    languageOptions: {
      globals: {
        ...jest.globals,
      },
    },
  },
  { ...jest.configs["flat/recommended"], files },
  { ...jest.configs["flat/style"], files },
];
