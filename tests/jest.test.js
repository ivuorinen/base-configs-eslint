import { makeLint, describeRules } from './helpers.js'
import config from '../jest.cjs'

const jestSettings = { settings: { jest: { version: 27 } } }
const lint = makeLint([jestSettings, ...config], 'my.test.js')

describeRules('jest config', lint, [
  {
    rule: 'jest/no-disabled-tests',
    passes: "test('my test', () => { expect(1).toBe(1) })\n",
    passDesc: 'active test',
    catches: "test.skip('my test', () => { expect(1).toBe(1) })\n",
    catchDesc: 'test.skip',
  },
  {
    rule: 'jest/expect-expect',
    passes: "test('my test', () => { expect(1).toBe(1) })\n",
    passDesc: 'test with an assertion',
    catches: "test('my test', () => {})\n",
    catchDesc: 'test body with no assertion',
  },
])
