import { describe, it, expect } from 'vitest'
import { Linter } from 'eslint'
import config from '../index.cjs'

const lint = (code, filename = 'test.js') => new Linter().verify(code, config, filename)
const hasRule = (messages, ruleId) => messages.some(m => m.ruleId === ruleId)

describe('index config — smoke', () => {
  it('loads and runs without throwing', () => {
    expect(() => lint('')).not.toThrow()
  })
})

describe('index config — func-style', () => {
  it('passes: function declaration', () => {
    const messages = lint('function foo() { return 1 }\n')
    expect(hasRule(messages, 'func-style')).toBe(false)
  })

  it('catches: function expression assigned to variable', () => {
    const messages = lint('const f = function() { return 1 }\n')
    expect(hasRule(messages, 'func-style')).toBe(true)
  })
})

describe('index config — no-var', () => {
  it('passes: const declaration', () => {
    const messages = lint('const x = 1\n')
    expect(hasRule(messages, 'no-var')).toBe(false)
  })

  it('catches: var declaration', () => {
    const messages = lint('var x = 1\n')
    expect(hasRule(messages, 'no-var')).toBe(true)
  })
})

describe('index config — prefer-const', () => {
  it('passes: const declaration', () => {
    const messages = lint('const x = 1\n')
    expect(hasRule(messages, 'prefer-const')).toBe(false)
  })

  it('catches: let that is never reassigned', () => {
    const messages = lint('let x = 1\n')
    expect(hasRule(messages, 'prefer-const')).toBe(true)
  })
})
