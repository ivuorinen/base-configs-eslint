import { describe, it, expect } from 'vitest'
import { Linter } from 'eslint'

const hasRule = (messages, ruleId) =>
  messages.some(m => m.ruleId === ruleId)

export const makeLint = (config, defaultFilename) =>
  (code, filename = defaultFilename) =>
    new Linter().verify(code, config, filename)

export const describeRules = (configName, lint, rules) => {
  describe(`${configName} — smoke`, () => {
    it('loads and runs without throwing', () => {
      expect(() => lint('')).not.toThrow()
    })
  })

  for (const { rule, passes, passDesc, catches, catchDesc } of rules) {
    describe(`${configName} — ${rule}`, () => {
      it(`passes: ${passDesc}`, () => {
        expect(hasRule(lint(passes), rule)).toBe(false)
      })

      it(`catches: ${catchDesc}`, () => {
        expect(hasRule(lint(catches), rule)).toBe(true)
      })
    })
  }
}
