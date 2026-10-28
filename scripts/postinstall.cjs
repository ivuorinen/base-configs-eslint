"use strict";

/* eslint no-console: "off" -- CLI app that gives users feedback */

const { writeStarterConfig } = require("@ivuorinen/config-checker");

// This runs on every consumer install, and a non-zero exit fails that whole
// install. writeStarterConfig never throws: it falls back to the working
// directory when INIT_CWD is unset, creates the file with "wx" so a config a
// concurrent install wrote is never overwritten, and returns a failed write for
// this script to report.
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
const result = writeStarterConfig("eslint", "eslint.config.mjs", fileConfig);

if (result.status === "found") {
  console.log("eslint-config: Found existing eslint config file, skipping creation.");
  console.log("eslint-config: If you want to create a new config file, please remove the existing one.");
  console.log(`eslint-config: Found config files at: ${result.found.join(", ")}`);
} else if (result.status === "failed") {
  console.log(`eslint-config: could not write ${result.filePath} (${result.error.code || result.error.message}).`);
  console.log("eslint-config: create it manually and spread @ivuorinen/eslint-config into its export.");
}
