# @ivuorinen/eslint-config <!-- omit in toc -->

[![npm package][npm-badge]][npm-link] [![license MIT][license-badge]][license-link] [![ivuorinen's Code Style][style-badge]][style-link]

> ivuorinen's shareable configuration for [`ESLint`][eslint-link].

## Table of Contents <!-- omit in toc -->

- [Installation](#installation)
- [Available Configurations](#available-configurations)
  - [Jest](#jest)
- [Documentations](#documentations)
- [Contributing](#contributing)
- [Changelog](#changelog)
- [License](#license)

## Installation

Install `this config` as a _`devDependencies`_:

```sh
# npm
npm install @ivuorinen/eslint-config --save-dev

# Yarn
yarn add @ivuorinen/eslint-config --dev
```

This package is a [flat config][flat-config-link] for ESLint 10, which no longer reads `.eslintrc*` files. Create an
_`eslint.config.mjs`_ in the project's root folder:

```js
import ivuorinenConfig from '@ivuorinen/eslint-config'

export default [
  ...ivuorinenConfig,

  // your modifications
  {
    rules: {
      // "no-unused-vars": "warn"
    }
  }
]
```

With npm, a `postinstall` script writes exactly this file when the project has no ESLint config yet (npm 11 warns
that the script is not covered by `allowScripts`). Yarn 4 does not run dependency install scripts, so no file is
written. pnpm refuses unapproved install scripts and fails the install until you allow this package with
`pnpm approve-builds` (or list it in `onlyBuiltDependencies`). In both cases create the file by hand as above.

## Available Configurations

### Jest

Adds specific rules for the [`Jest`][jest-link] testing framework. Every element is scoped to test files
(`**/*.{test,spec}.{js,mjs,cjs}` and `**/__tests__/**`), so it can be spread next to the base config:

```js
import ivuorinenConfig from '@ivuorinen/eslint-config'
import ivuorinenJest from '@ivuorinen/eslint-config/jest'

export default [...ivuorinenConfig, ...ivuorinenJest]
```

To use a different test-file pattern, override `files` on each element:

```js
export default [
  ...ivuorinenConfig,
  ...ivuorinenJest.map(config => ({ ...config, files: ['test/**/*.js'] }))
]
```

## Documentations

Read the [ESLint docs][eslint-docs-link] for more information.

## Contributing

If you are interested in helping contribute, please open an [issue][issue-link] or [pull request][pull-request-link].

## Changelog

See [CHANGELOG][changelog-link] for a human-readable history of changes.

## License

Distributed under the MIT License. See [LICENSE][license-link] for more information.

[changelog-link]: https://github.com/ivuorinen/base-configs-eslint/releases
[eslint-docs-link]: https://eslint.org
[eslint-link]: https://github.com/eslint/eslint
[flat-config-link]: https://eslint.org/docs/latest/use/configure/configuration-files
[issue-link]: https://github.com/ivuorinen/base-configs-eslint/issues
[license-badge]: https://img.shields.io/github/license/ivuorinen/base-configs-eslint?style=flat-square&labelColor=292a44&color=663399
[license-link]: ./LICENSE.md
[npm-badge]: https://img.shields.io/npm/v/@ivuorinen/eslint-config?style=flat-square&labelColor=292a44&color=663399
[npm-link]: https://www.npmjs.com/package/@ivuorinen/eslint-config
[pull-request-link]: https://github.com/ivuorinen/base-configs-eslint/pulls
[style-badge]: https://img.shields.io/badge/code_style-ivuorinen%E2%80%99s-663399.svg?labelColor=292a44&style=flat-square
[style-link]: https://github.com/ivuorinen/base-configs-eslint
[jest-link]: https://jestjs.io
