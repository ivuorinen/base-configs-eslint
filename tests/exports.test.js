import { describe, it, expect } from 'vitest'
import { createRequire } from 'node:module'

// Resolve through the package's own name so the published `exports` map is
// exercised, not the files on disk. A condition pointing at a missing file
// fails here exactly as it would for a consumer.
const require = createRequire(import.meta.url)

describe('exports map', () => {
  for (const specifier of ['@ivuorinen/eslint-config', '@ivuorinen/eslint-config/jest']) {
    it(`${specifier} resolves via require`, () => {
      const config = require(specifier)
      expect(Array.isArray(config) && config.length > 0).toBe(true)
    })

    // vitest loads the CJS file again for import(), so identity cannot hold;
    // the same number of config objects proves the wrapper re-exports it.
    it(`${specifier} resolves via import to the same config`, async () => {
      const config = (await import(specifier)).default
      expect(Array.isArray(config)).toBe(true)
      expect(config.length).toBe(require(specifier).length)
    })
  }
})
