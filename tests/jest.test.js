import { describe, it, expect } from 'vitest'
import { hasRule, makeLint } from './helpers.js'
import config from '../jest.cjs'

const jestSettings = { settings: { jest: { version: 27 } } }
const lint = makeLint([jestSettings, ...config], 'my.test.js')

describe('jest config — smoke', () => {
  it('loads and runs without throwing', () => {
    expect(() => lint('')).not.toThrow()
  })
})

describe('jest config — jest/no-disabled-tests', () => {
  it('passes: active test', () => {
    const messages = lint("test('my test', () => { expect(1).toBe(1) })\n")
    expect(hasRule(messages, 'jest/no-disabled-tests')).toBe(false)
  })

  it('catches: test.skip', () => {
    const messages = lint("test.skip('my test', () => { expect(1).toBe(1) })\n")
    expect(hasRule(messages, 'jest/no-disabled-tests')).toBe(true)
  })
})

describe('jest config — jest/expect-expect', () => {
  it('passes: test with an assertion', () => {
    const messages = lint("test('my test', () => { expect(1).toBe(1) })\n")
    expect(hasRule(messages, 'jest/expect-expect')).toBe(false)
  })

  it('catches: test body with no assertion', () => {
    const messages = lint("test('my test', () => {})\n")
    expect(hasRule(messages, 'jest/expect-expect')).toBe(true)
  })
})
