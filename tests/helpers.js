import { Linter } from 'eslint'

export const hasRule = (messages, ruleId) =>
  messages.some(m => m.ruleId === ruleId)

export const makeLint = (config, defaultFilename) =>
  (code, filename = defaultFilename) =>
    new Linter().verify(code, config, filename)
