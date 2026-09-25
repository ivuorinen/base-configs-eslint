"use strict";

const globals = require("globals");
const configEslint = require("eslint-config-eslint");
const configPrettier = require("eslint-config-prettier");
const pluginJs = require("@eslint/js");

/**
 * @type { import("eslint").Linter.Config[] } config eslint configuration.
 */
module.exports = [
  ...configEslint,
  {
    linterOptions: {
      reportUnusedDisableDirectives: "warn",
    },
    rules: {
      "func-style": [
        "error",
        "declaration",
        {
          allowArrowFunctions: true,
        },
      ],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.es2021,
        ...globals.node,
      },
      // No ecmaVersion override: flat config defaults to "latest". Pinning an
      // older version turns newer syntax (class private fields, top-level
      // await) into a fatal parse error, which runs no rules on the file.
    },
  },
  pluginJs.configs.recommended,
  configPrettier,
  {
    ignores: ["coverage/", "dist/", "lib/", "node_modules/"],
  },
];
