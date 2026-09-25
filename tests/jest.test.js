import { describe, it, expect } from 'vitest'
import { makeLint, describeRules } from './helpers.js'
import base from '../index.cjs'
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

// Spread next to the base config, as the README shows, the Jest globals and
// rules must stay on test files. Applied everywhere they define `describe` and
// `expect` as globals in production code, so no-undef stops catching them.
describe('jest config — scoped to test files', () => {
  const lintApp = makeLint([jestSettings, ...base, ...config], 'src/app.js')
  const messages = lintApp("describe('x', () => {})\ntest.skip('a', () => {})\n")

  it('fires no jest/* rule on a non-test file', () => {
    expect(messages.filter(m => (m.ruleId || '').startsWith('jest/'))).toStrictEqual([])
  })

  it('leaves Jest globals undefined in a non-test file', () => {
    expect(messages.filter(m => m.ruleId === 'no-undef').length).toBe(2)
  })
})
