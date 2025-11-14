# Codometer

[![npm version](https://badge.fury.io/js/@nurv-llc%2Fcodometer.svg)](https://www.npmjs.com/package/@nurv-llc/codometer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A TypeScript library for analyzing code repositories and providing detailed metrics about lines of code, documentation, and file counts with intelligent filtering capabilities.

## Features

- 📊 **Accurate Line Counting** - Separate code lines from documentation and comments
- 🎯 **Smart Language Detection** - Automatic parser selection based on file type
- 🚫 **Intelligent Filtering** - Respects .gitignore by default, with test exclusion support
- 📝 **Documentation Analysis** - Tracks inline comments and markdown files separately
- ⚡ **Performance** - Efficiently handles large repositories
- 🔧 **Zero Dependencies** - No runtime dependencies for maximum reliability

## Supported Languages

- JavaScript/TypeScript (including JSX/TSX)
- Python (with docstring detection)
- C# (with XML doc comments)
- C/C++ (with header files)
- Rust (with doc comments)
- Markdown (pure documentation)

## Installation

```bash
# Using npx (recommended)
npx @nurv-llc/codometer

# Global installation
npm install -g @nurv-llc/codometer

# Local installation
npm install @nurv-llc/codometer
```

## Usage

### Command Line

```bash
# Analyze current directory
codometer

# Analyze specific directory
codometer ./src

# Ignore .gitignore rules
codometer --ignore-gitignore

# Exclude test files
codometer --exclude-tests="*.spec.ts,**/__tests__/**"

# Verbose output with per-file details
codometer --verbose

# Show help
codometer --help
```

### Programmatic API

```typescript
import { Analyzer } from '@nurv-llc/codometer';

const analyzer = new Analyzer({
  rootPath: '/path/to/project',
  respectGitignore: true,
  excludeTests: '*.spec.ts,**/__tests__/**',
  followSymlinks: false,
  includeHidden: false,
  verbose: false,
  maxFileSize: 10 * 1024 * 1024, // 10MB
});

const result = await analyzer.analyze();

console.log(`Files: ${result.totalFiles}`);
console.log(`Lines of Code: ${result.linesOfCode}`);
console.log(`Lines of Documentation: ${result.linesOfDocumentation}`);
```

## CLI Options

| Option | Description |
|--------|-------------|
| `--ignore-gitignore` | Ignore .gitignore rules and scan all files |
| `--exclude-tests=<glob>` | Exclude test files matching glob patterns |
| `--follow-symlinks` | Follow symbolic links during scan |
| `--include-hidden` | Include hidden files and directories |
| `--verbose` | Show detailed per-file metrics |
| `-h, --help` | Show help message |
| `-v, --version` | Show version number |

## Output Format

```
==================================================
Code Metrics Summary
==================================================

Files: 42
Lines of Code: 3521
Lines of Documentation: 892
  - Comments: 654
  - Markdown Files: 238

--------------------------------------------------
Language Breakdown
--------------------------------------------------

JavaScript/TypeScript:
  Files: 35
  Lines of Code: 2890
  Comment Lines: 543

Python:
  Files: 5
  Lines of Code: 631
  Comment Lines: 111

Markdown:
  Files: 2
  Lines of Code: 0
  Comment Lines: 238
```

## How It Works

1. **File Discovery** - Recursively scans directories, respecting filters
2. **Binary Detection** - Automatically skips binary files
3. **Parser Selection** - Chooses appropriate parser based on file extension
4. **Line Analysis** - Accurately counts code vs documentation lines
5. **Aggregation** - Combines results into comprehensive metrics

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Format
npm run format
```

## License

MIT © Nurv LLC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Repository

[https://github.com/cyb3rsyph0n/codometer](https://github.com/cyb3rsyph0n/codometer)
