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

# JSON output for scripting
codometer --output-json --silent

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
| `--output-json` | Output results in JSON format for programmatic consumption |
| `--silent` | Suppress progress output (useful for scripts and pipelines) |
| `-h, --help` | Show help message |
| `-v, --version` | Show version number |

## Output Format

### Text Output (Default)

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

### JSON Output

When using `--output-json`, the output is structured for programmatic consumption:

```json
{
  "summary": {
    "totalFiles": 42,
    "linesOfCode": 3521,
    "linesOfDocumentation": 892,
    "commentLines": 654,
    "markdownLines": 238
  },
  "languages": [
    {
      "name": "JavaScript/TypeScript",
      "files": 35,
      "linesOfCode": 2890,
      "commentLines": 543
    },
    {
      "name": "Python",
      "files": 5,
      "linesOfCode": 631,
      "commentLines": 111
    }
  ]
}
```

### Integration Examples

**Shell Scripts:**
```bash
# Get total lines of code
LOC=$(codometer --output-json --silent | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).summary.linesOfCode)")

# Check if codebase exceeds threshold
if [ "$LOC" -gt 10000 ]; then
  echo "Warning: Codebase has grown to $LOC lines"
fi
```

**CI/CD Pipelines:**
```yaml
# Example GitHub Actions workflow
- name: Analyze code metrics
  run: |
    npx @nurv-llc/codometer --output-json --silent > metrics.json
    
- name: Upload metrics
  uses: actions/upload-artifact@v3
  with:
    name: code-metrics
    path: metrics.json
```

## Exit Codes

Codometer uses standard exit codes to indicate success or failure, making it suitable for use in CI/CD pipelines:

| Exit Code | Description |
|-----------|-------------|
| `0` | Success - analysis completed without errors |
| `1` | General error during analysis |
| `2` | Invalid arguments provided |
| `3` | Specified path does not exist |
| `4` | Permission error accessing files |
| `5` | Error during file scanning |
| `6` | Error during analysis |

Errors are written to stderr to allow proper separation from results.

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
