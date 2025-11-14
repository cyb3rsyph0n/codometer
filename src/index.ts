#!/usr/bin/env node

import { promises as fs } from 'fs';
import { resolve } from 'path';
import { Analyzer } from './core/analyzer';
import { ScanOptions } from './core/types';
import { parseCliArgs, getHelpText } from './utils/cli-parser';
import { formatSummary, formatVerboseOutput, formatJsonOutput } from './utils/output-formatter';
import { EXIT_CODES } from './utils/exit-codes';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

async function main() {
  const args = process.argv.slice(2);
  const options = parseCliArgs(args);

  if (options.help) {
    console.log(getHelpText());
    process.exit(EXIT_CODES.SUCCESS);
  }

  if (options.version) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const packageJson = require('../package.json');
    console.log(`codometer v${packageJson.version}`);
    process.exit(EXIT_CODES.SUCCESS);
  }

  const rootPath = resolve(options.path || process.cwd());

  try {
    const stats = await fs.stat(rootPath);
    if (!stats.isDirectory()) {
      process.stderr.write(`Error: ${rootPath} is not a directory\n`);
      process.exit(EXIT_CODES.INVALID_ARGS);
    }
  } catch (error) {
    process.stderr.write(`Error: Path ${rootPath} does not exist\n`);
    process.exit(EXIT_CODES.PATH_NOT_FOUND);
  }

  const scanOptions: ScanOptions = {
    rootPath,
    respectGitignore: !options.ignoreGitignore,
    excludeTests: options.excludeTests,
    followSymlinks: options.followSymlinks,
    includeHidden: options.includeHidden,
    verbose: options.verbose,
    maxFileSize: MAX_FILE_SIZE,
    silent: options.silent,
  };

  try {
    const analyzer = new Analyzer(scanOptions);
    const result = await analyzer.analyze();

    if (options.outputJson) {
      console.log(formatJsonOutput(result));
    } else {
      if (options.verbose) {
        console.log(formatVerboseOutput(result));
      }
      console.log(formatSummary(result));
    }

    process.exit(EXIT_CODES.SUCCESS);
  } catch (error) {
    process.stderr.write(`Error during analysis: ${error}\n`);
    process.exit(EXIT_CODES.GENERAL_ERROR);
  }
}

if (require.main === module) {
  main();
}

export { Analyzer } from './core/analyzer';
export { Scanner } from './core/scanner';
export { Counter } from './core/counter';
export { ParserRegistry } from './parsers/parser-registry';
export * from './core/types';
