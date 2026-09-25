"use strict";

/* eslint no-console: "off", n/no-process-exit: "off" -- CLI app that gives users feedback */

const fs = require("node:fs");
const path = require("node:path");
const process = require("node:process");
const checkConfig = require("@ivuorinen/config-checker");

// This runs on every consumer install, and a non-zero exit fails that whole
// install. The starter config is a convenience, so every step below degrades to
// a message instead of throwing.

// INIT_CWD is an npm/yarn convention, not a guarantee.
const cwd = process.env.INIT_CWD || process.cwd();
const foundConfig = checkConfig("eslint", cwd);

if (foundConfig.length > 0) {
  console.log("eslint-config: Found existing eslint config file, skipping creation.");
  console.log("eslint-config: If you want to create a new config file, please remove the existing one.");
  console.log(`eslint-config: Found config files at: ${foundConfig.join(", ")}`);
  process.exit(0);
}

const filePath = path.join(cwd, "eslint.config.mjs");
const fileConfig = `import ivuorinenConfig from '@ivuorinen/eslint-config';

export default [
  ...ivuorinenConfig,

  // your modifications
  {
    rules: {
      // "no-unused-vars": "warn"
    }
  }
];
`;

// "wx" makes "does it exist?" and "write it" one atomic step, so a concurrent
// install cannot create the file in between and have it overwritten.
try {
  fs.writeFileSync(filePath, fileConfig, { flag: "wx" });
} catch (error) {
  if (error.code !== "EEXIST") {
    console.log(`eslint-config: could not write ${filePath} (${error.code || error.message}).`);
    console.log("eslint-config: create it manually and spread @ivuorinen/eslint-config into its export.");
  }
}
