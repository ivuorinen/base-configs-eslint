---
id: audit-417e79c5
auditor: audit
severity: low
category: tests
area: .github/workflows/test.yml
status: open
found: 2026-10-27
location: .github/workflows/test.yml:36
location_sha: 70a71aea2492d549
---

# CI tests one of the Node lines engines admits

## Problem

The test job runs on the single Node version in `.nvmrc` (v24). `engines.node` is `^20.19.0 || ^22.13.0 || >=24`, so two
of the three supported lines never run the suite.

## Evidence

`test.yml:36` `node-version-file: ".nvmrc"`; `.nvmrc` is `v24`. browserslist, commitlint, markdownlint and prettier run
a matrix starting at their `engines` floor (e.g. `node-version: ["20", "22", "24", "26"]`).

## Impact

A dependency update that raises its own floor above 20.19 or 22.13 ships green and breaks consumers on the declared floor.

## Fix

Use the same matrix as the four standalone repos: `node-version: ["20.19.0", "22.13.0", "24", "26"]`. The required check
name changes from `Test` to `Test (Node …)`, so update ruleset 24025418 in the same change.

## Status — workflow changed, ruleset pending (2026-10-27)

`fix/audit-2026-10` 3e18bed runs test.yml on Node 20.19.0, 22.13.0, 24 and 26;
the suite passes locally on 20.19.0, 22.13.0 and 26 (25/25). Ruleset 24025418
still requires `Test`, which the matrix no longer produces; replace it with
`Test (Node 20.19.0)`, `Test (Node 22.13.0)`, `Test (Node 24)` and
`Test (Node 26)` when the branch is pushed, then resolve this finding.
