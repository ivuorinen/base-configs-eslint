import { describe, it, expect } from 'vitest'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

// Drive the script as a real subprocess against real directories. What can
// break is the filesystem behaviour a consumer's `npm install` triggers, so
// mocking fs would test nothing that matters.
const SCRIPT = fileURLToPath(new URL('../scripts/postinstall.cjs', import.meta.url))
const CONFIG_NAME = 'eslint.config.mjs'

const tempRoot = () => fs.mkdtempSync(path.join(os.tmpdir(), 'eslint-config-'))

/**
 * Run the script as npm would.
 * @param {Object} options Where to run it.
 * @param {string} options.cwd Working directory of the process.
 * @param {string|null} [options.initCwd] INIT_CWD to set; `null` unsets it entirely.
 * @returns {import('node:child_process').SpawnSyncReturns<string>} The finished process.
 */
const run = ({ cwd, initCwd = cwd }) => {
  const env = { ...process.env }
  delete env.INIT_CWD
  if (initCwd !== null) {
    env.INIT_CWD = initCwd
  }
  return spawnSync(process.execPath, [SCRIPT], { cwd, env, encoding: 'utf8' })
}

const withRoot = fn => () => {
  const root = tempRoot()
  try {
    fn(root)
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
}

describe('postinstall', () => {
  it('writes the starter config when the project has none', withRoot(root => {
    const result = run({ cwd: root })

    expect(result.status, result.stderr).toBe(0)
    expect(fs.readFileSync(path.join(root, CONFIG_NAME), 'utf8')).toContain("from '@ivuorinen/eslint-config'")
  }))

  it('leaves an existing config untouched', withRoot(root => {
    const existing = path.join(root, CONFIG_NAME)
    const original = 'export default []\n'
    fs.writeFileSync(existing, original)

    const result = run({ cwd: root })

    expect(result.status, result.stderr).toBe(0)
    expect(fs.readFileSync(existing, 'utf8')).toBe(original)
    expect(result.stdout).toMatch(/skipping creation/u)
  }))

  // Regression guard: path.join(undefined) threw ERR_INVALID_ARG_TYPE and
  // exited 1, failing the consumer's whole install when run outside a package
  // manager.
  it('falls back to the working directory when INIT_CWD is unset', withRoot(root => {
    const result = run({ cwd: root, initCwd: null })

    expect(result.status, result.stderr).toBe(0)
    expect(fs.existsSync(path.join(root, CONFIG_NAME))).toBe(true)
  }))

  // Regression guard: an uncaught write error aborts the consumer's entire
  // install. The unwritable target is a regular file rather than a 0555
  // directory so the ENOTDIR holds even when the tests run as root.
  it('does not fail the install when the config cannot be written', withRoot(root => {
    const target = path.join(root, 'not-a-directory')
    fs.writeFileSync(target, '')

    const result = run({ cwd: root, initCwd: target })

    expect(result.status, result.stderr).toBe(0)
    expect(result.stdout).toMatch(/could not write/u)
    expect(fs.existsSync(path.join(root, CONFIG_NAME))).toBe(false)
  }))
})
