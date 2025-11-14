import { CLIOptions } from '../core/types';

export function parseCliArgs(args: string[]): CLIOptions {
  const options: CLIOptions = {
    ignoreGitignore: false,
    followSymlinks: false,
    includeHidden: false,
    verbose: false,
    help: false,
    version: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--version' || arg === '-v') {
      options.version = true;
    } else if (arg === '--ignore-gitignore') {
      options.ignoreGitignore = true;
    } else if (arg === '--follow-symlinks') {
      options.followSymlinks = true;
    } else if (arg === '--include-hidden') {
      options.includeHidden = true;
    } else if (arg === '--verbose') {
      options.verbose = true;
    } else if (arg.startsWith('--exclude-tests=')) {
      options.excludeTests = arg.substring('--exclude-tests='.length);
    } else if (!arg.startsWith('-')) {
      options.path = arg;
    }
  }

  return options;
}

export function getHelpText(): string {
  return `
codometer - Code Metrics Analysis Tool

Usage: codometer [path] [options]

Arguments:
  path                    Path to analyze (default: current directory)

Options:
  --ignore-gitignore      Ignore .gitignore rules and scan all files
  --exclude-tests=<glob>  Exclude test files matching glob patterns
  --follow-symlinks       Follow symbolic links
  --include-hidden        Include hidden files and directories
  --verbose               Show detailed per-file metrics
  -h, --help              Show this help message
  -v, --version           Show version number

Examples:
  codometer
  codometer ./src
  codometer --exclude-tests="*.spec.ts,**/__tests__/**"
  codometer --ignore-gitignore --verbose
`.trim();
}
