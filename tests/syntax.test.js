import { describe, it, expect } from 'vitest'
import { makeLint } from './helpers.js'
import config from '../index.cjs'

// A parser setting older than the syntax a consumer writes turns the whole
// file into one fatal "Parsing error" and runs no rules on it, so a config
// can pass every rule test below and still lint nothing in a modern project.
const lint = makeLint(config, 'src/module.mjs')

const fatal = code => lint(code).filter(m => m.fatal).map(m => m.message)

describe('index config — modern syntax parses', () => {
  it('ES2022 class private fields', () => {
    expect(fatal('class A { #x = 1\n  get() { return this.#x } }\nexport default A\n')).toStrictEqual([])
  })

  it('ES2022 top-level await in a module', () => {
    expect(fatal('const x = await Promise.resolve(1)\nexport { x }\n')).toStrictEqual([])
  })

  it('ES2024 regex v flag', () => {
    expect(fatal('const r = /[\\p{L}--\\p{Ll}]/v\nexport { r }\n')).toStrictEqual([])
  })
})
