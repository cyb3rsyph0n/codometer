# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `--output-json` flag for JSON formatted output for programmatic consumption
- `--silent` flag to suppress progress and informational output for scripting
- JSON output format with structured summary and language breakdown data
- Comprehensive exit codes for better pipeline integration
- Documentation for exit codes and pipeline integration examples

### Changed
- Progress display now respects silent mode
- Error messages now consistently output to stderr instead of stdout
- Exit codes expanded to cover more error scenarios (scan errors, analysis errors)

## [0.1.0] - 2024-11-14

### Added
- Initial release
- Line counting for code and documentation
- Support for JavaScript/TypeScript, Python, C#, C++, Rust
- Markdown file handling
- .gitignore respect (default behavior)
- Test file exclusion with glob patterns
- CLI interface with multiple options
- Progress indicator for large scans
- Verbose mode for per-file details
