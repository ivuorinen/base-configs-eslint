import { makeLint, describeRules } from './helpers.js'
import config from '../index.cjs'

const lint = makeLint(config, 'test.js')

describeRules('index config', lint, [
  {
    rule: 'func-style',
    passes: 'function foo() { return 1 }\n',
    passDesc: 'function declaration',
    catches: 'const f = function() { return 1 }\n',
    catchDesc: 'function expression assigned to variable',
  },
  {
    rule: 'no-var',
    passes: 'const x = 1\n',
    passDesc: 'const declaration',
    catches: 'var x = 1\n',
    catchDesc: 'var declaration',
  },
  {
    rule: 'prefer-const',
    passes: 'const x = 1\n',
    passDesc: 'const declaration',
    catches: 'let x = 1\n',
    catchDesc: 'let that is never reassigned',
  },
])
