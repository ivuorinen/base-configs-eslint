# Architecture Profile

Generated: 2026-09-25

Confidence: none — manual review required

## Detected Patterns

Detected: none.

No catalogued pattern reaches Low confidence. Structural evidence:

- Source is five files: `index.cjs` and `jest.cjs` (flat-config arrays), `wrapper.mjs` and `wrapper-jest.mjs` (ESM
  re-exports of each), and `scripts/postinstall.cjs` (install-time starter-file writer).
- Import edges: `index.cjs` → `eslint-config-eslint`, `eslint-config-prettier`, `@eslint/js`, `globals`;
  `jest.cjs` → `eslint-plugin-jest`; each wrapper → its sibling `.cjs`; `scripts/postinstall.cjs` →
  `@ivuorinen/config-checker`. `index.cjs` and `jest.cjs` do not import each other; a consumer composes them.
- `package.json` `exports` routes `.` → `index.cjs`/`wrapper.mjs` and `./jest` → `jest.cjs`/`wrapper-jest.mjs`.
- `eslint.config.mjs` (the repo's own lint config) consumes `./wrapper.mjs`; `tests/*.test.js` import the `.cjs` files
  by relative path.

Shape, for orientation (descriptive, not a catalogued pattern): shareable-config package with two independent entry
points (base and jest) behind dual-format wrappers, plus one install-time script.

## Detected Combination

None.

## Inferred Structural Rules

None.

## Ambiguities & Contradictions

None structural. The tests bypass the `exports` map (relative imports), so they cannot observe entry-point defects;
recorded under the tests lens, not as an architecture rule.
