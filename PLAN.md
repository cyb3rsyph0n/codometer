# Implementation Plan: JSON Output and Silent Mode

## Overview
Add `--output-json` and `--silent` flags to enable JSON output format for programmatic consumption and pipeline integration.

## Requirements

### Functional Requirements
1. **JSON Output Flag (`--output-json`)**
   - Output format: `{summary: {}, languages: []}`
   - Include all metrics from current text output
   - Machine-readable format for tooling integration
   - Can be combined with existing flags (verbose, ignore-gitignore, etc.)

2. **Silent Mode Flag (`--silent`)**
   - Suppress progress bar display
   - Suppress any informational messages
   - Only output final result (text or JSON)
   - Useful for scripting and pipelines

3. **Error Handling**
   - Exit with non-zero code on errors
   - Ensure errors stop pipeline execution
   - Provide meaningful error messages to stderr

### Non-Functional Requirements
- Maintain backward compatibility
- Follow existing code patterns and architecture
- Achieve 90% test coverage for new code
- Update all documentation

## Implementation Steps

### Phase 1: Core Infrastructure

#### 1.1 Update Exit Codes (`src/utils/exit-codes.ts`)
**Files Modified:** `src/utils/exit-codes.ts`, `src/utils/exit-codes.spec.ts`

- Review and ensure comprehensive exit code coverage
- Add any missing error scenarios:
  - `EXIT_SUCCESS = 0`
  - `EXIT_INVALID_PATH = 1`
  - `EXIT_SCAN_ERROR = 2`
  - `EXIT_ANALYSIS_ERROR = 3`
  - `EXIT_INVALID_ARGS = 4`
- Document exit codes for users

#### 1.2 Update CLI Types (`src/core/types.ts`)
**Files Modified:** `src/core/types.ts`

Add new flags to `CLIOptions` interface:
```typescript
export interface CLIOptions {
  // ... existing fields
  outputJson?: boolean;
  silent?: boolean;
}
```

### Phase 2: CLI Argument Parsing

#### 2.1 Update CLI Parser (`src/utils/cli-parser.ts`)
**Files Modified:** `src/utils/cli-parser.ts`, `src/utils/cli-parser.spec.ts`

**Changes:**
- Add support for `--output-json` flag
- Add support for `--silent` flag
- Update help text to include new flags
- Validate flag combinations (if any restrictions)

**Implementation Details:**
```typescript
// Add to parseCliArgs function
if (arg === '--output-json') {
  options.outputJson = true;
}
if (arg === '--silent') {
  options.silent = true;
}
```

**Unit Tests:**
- Test `--output-json` flag parsing
- Test `--silent` flag parsing
- Test combination of both flags
- Test combination with other existing flags
- Test help text includes new flags

### Phase 3: JSON Output Formatter

#### 3.1 Create JSON Output Type Definitions (`src/core/types.ts`)
**Files Modified:** `src/core/types.ts`

Define JSON output structure:
```typescript
export interface JsonOutput {
  summary: {
    totalFiles: number;
    linesOfCode: number;
    linesOfDocumentation: number;
    commentLines: number;
    markdownLines: number;
  };
  languages: Array<{
    name: string;
    files: number;
    linesOfCode: number;
    commentLines: number;
  }>;
}
```

#### 3.2 Implement JSON Formatter (`src/utils/output-formatter.ts`)
**Files Modified:** `src/utils/output-formatter.ts`, `src/utils/output-formatter.spec.ts`

**New Function:**
```typescript
export function formatJsonOutput(result: AnalysisResult): string
```

**Implementation Details:**
- Convert `AnalysisResult` to `JsonOutput` structure
- Convert `Map<string, LanguageMetrics>` to sorted array
- Sort languages by linesOfCode (descending) for consistency
- Use `JSON.stringify()` with proper formatting
- Return formatted JSON string

**Unit Tests:**
- Test basic JSON structure
- Test with empty results
- Test with single language
- Test with multiple languages
- Test language sorting order
- Test all numeric fields are included
- Test JSON is valid and parseable
- Test with verbose mode (if applicable)

### Phase 4: Silent Mode Implementation

#### 4.1 Update Progress Display (`src/utils/output-formatter.ts`)
**Files Modified:** `src/utils/output-formatter.ts`

**Changes:**
- Modify `showProgress` to accept `silent` parameter
- Skip progress output when `silent = true`
- Ensure no other informational output when silent

#### 4.2 Update Analyzer (`src/core/analyzer.ts`)
**Files Modified:** `src/core/analyzer.ts`, `src/core/analyzer.spec.ts`

**Changes:**
- Pass `silent` flag through `ScanOptions` or separate parameter
- Conditionally call `showProgress` based on silent flag
- Ensure no console output during silent mode

**Unit Tests:**
- Test progress is shown when silent = false
- Test progress is suppressed when silent = true
- Test analysis still completes correctly in silent mode

### Phase 5: Main Entry Point Integration

#### 5.1 Update Main CLI (`src/index.ts` or CLI entry point)
**Files Modified:** Main CLI file, integration tests

**Changes:**
1. Pass `outputJson` and `silent` flags to analyzer
2. Implement output logic:
   ```typescript
   if (options.outputJson) {
     console.log(formatJsonOutput(result));
   } else {
     console.log(options.verbose ? formatVerboseOutput(result) : formatSummary(result));
   }
   ```
3. Ensure proper error handling with exit codes
4. Write errors to stderr, not stdout
5. Exit with appropriate exit code on errors

**Error Handling Pattern:**
```typescript
try {
  // ... analysis code
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exit(EXIT_CODES.EXIT_ANALYSIS_ERROR);
}
```

### Phase 6: Integration Testing

#### 6.1 CLI Integration Tests
**Files Modified:** `tests/integration/cli-integration.test.ts`

**New Test Cases:**
1. `--output-json` produces valid JSON
2. `--output-json` contains expected structure
3. `--output-json` with `--verbose` (determine expected behavior)
4. `--silent` suppresses progress output
5. `--silent` with `--output-json` combination
6. Error scenarios produce correct exit codes
7. JSON output matches text output data
8. Pipeline usage: verify exit codes stop execution

**Test Implementation:**
- Use child_process to spawn CLI
- Parse stdout as JSON when `--output-json` used
- Verify stderr contains errors
- Check process exit codes
- Test with real fixture data

#### 6.2 End-to-End Tests
**Files Modified:** Create new E2E test file or extend existing

**Test Scenarios:**
1. Real directory analysis with JSON output
2. Silent mode with no progress output
3. Error cases (invalid path, permissions)
4. Large codebase performance
5. Pipeline simulation (command1 && command2)

### Phase 7: Documentation

#### 7.1 Update README.md
**Files Modified:** `README.md`

**Sections to Update:**

1. **Features Section:**
   - Add JSON output capability
   - Add silent mode for scripting

2. **Usage Section:**
   - Add `--output-json` flag documentation
   - Add `--silent` flag documentation
   - Show updated help output

3. **Examples Section:**
   Add new examples:
   ```bash
   # JSON output
   codometer /path/to/project --output-json

   # Silent mode with JSON (for pipelines)
   codometer /path/to/project --output-json --silent

   # Pipeline usage example
   codometer . --output-json --silent | jq '.summary.linesOfCode'

   # Use in scripts
   if codometer . --silent; then
     echo "Analysis successful"
   else
     echo "Analysis failed"
     exit 1
   fi
   ```

4. **JSON Output Format Section (New):**
   Document the JSON structure:
   ```json
   {
     "summary": {
       "totalFiles": 42,
       "linesOfCode": 1250,
       "linesOfDocumentation": 350,
       "commentLines": 200,
       "markdownLines": 150
     },
     "languages": [
       {
         "name": "TypeScript",
         "files": 30,
         "linesOfCode": 1000,
         "commentLines": 150
       }
     ]
   }
   ```

5. **Exit Codes Section (New):**
   Document all exit codes and their meanings

6. **Integration Examples Section (New):**
   Show integration with common tools:
   - jq for JSON processing
   - CI/CD pipeline examples
   - Shell script examples

#### 7.2 Update CHANGELOG.md
**Files Modified:** `CHANGELOG.md`

Add new version entry:
```markdown
## [Unreleased]

### Added
- `--output-json` flag for JSON formatted output
- `--silent` flag to suppress progress and informational output
- JSON output format for programmatic consumption
- Exit codes documentation
- Pipeline and tooling integration examples

### Changed
- Progress display respects silent mode
- Errors now consistently output to stderr
```

#### 7.3 Update Help Text
**Files Modified:** `src/utils/cli-parser.ts`

Add to help output:
```
  --output-json         Output results in JSON format
  --silent              Suppress progress output (useful for scripts)
```

### Phase 8: Quality Assurance

#### 8.1 Code Review Checklist
- [ ] All TypeScript compilation passes without errors
- [ ] All existing tests still pass
- [ ] New tests achieve 90% coverage
- [ ] Code follows existing style and patterns
- [ ] No breaking changes to existing API
- [ ] Error messages are clear and helpful
- [ ] JSON output is well-formed and consistent

#### 8.2 Manual Testing
- [ ] Test on Windows, macOS, Linux (if applicable)
- [ ] Test with various project sizes
- [ ] Test all flag combinations
- [ ] Test error scenarios
- [ ] Test in actual pipelines
- [ ] Verify JSON parseable by common tools (jq, Python json module)

#### 8.3 Performance Testing
- [ ] Verify no performance regression
- [ ] Test with large codebases (>1000 files)
- [ ] Memory usage remains acceptable

## Implementation Order

1. **Foundation** (Phase 1): Exit codes and type definitions
2. **Parsing** (Phase 2): CLI argument parsing
3. **Core Logic** (Phase 3-4): JSON formatter and silent mode
4. **Integration** (Phase 5): Main entry point
5. **Testing** (Phase 6): Integration and E2E tests
6. **Documentation** (Phase 7): README, CHANGELOG, help text
7. **QA** (Phase 8): Review and testing

## Files to Create
- None (all changes are modifications to existing files)

## Files to Modify

### Core Implementation
1. `src/core/types.ts` - Add CLIOptions fields and JsonOutput interface
2. `src/utils/exit-codes.ts` - Review/add exit codes
3. `src/utils/cli-parser.ts` - Parse new flags
4. `src/utils/output-formatter.ts` - Add JSON formatter, update progress
5. `src/core/analyzer.ts` - Pass silent flag, respect it
6. `src/index.ts` - Integrate new output modes and error handling

### Tests
7. `src/utils/exit-codes.spec.ts` - Test exit codes
8. `src/utils/cli-parser.spec.ts` - Test new flag parsing
9. `src/utils/output-formatter.spec.ts` - Test JSON formatter
10. `src/core/analyzer.spec.ts` - Test silent mode
11. `tests/integration/cli-integration.test.ts` - E2E tests

### Documentation
12. `README.md` - Usage examples and JSON format docs
13. `CHANGELOG.md` - Version history entry

## Estimated Effort
- Phase 1: 1-2 hours
- Phase 2: 2-3 hours
- Phase 3: 3-4 hours
- Phase 4: 2-3 hours
- Phase 5: 2-3 hours
- Phase 6: 4-6 hours
- Phase 7: 2-3 hours
- Phase 8: 2-4 hours

**Total: 18-28 hours**

## Risks and Mitigations

### Risk 1: Breaking Changes
**Mitigation:** Extensive testing with existing functionality, maintain backward compatibility

### Risk 2: JSON Structure Changes
**Mitigation:** Version the JSON output if needed, document structure clearly

### Risk 3: Platform-Specific Issues
**Mitigation:** Test on multiple platforms, use platform-agnostic Node.js APIs

### Risk 4: Performance Impact
**Mitigation:** Profile before/after, optimize if needed

## Success Criteria
- [ ] `--output-json` flag produces valid, well-formed JSON
- [ ] `--silent` flag suppresses all progress output
- [ ] Errors exit with non-zero codes and stop pipelines
- [ ] All tests pass with >90% coverage
- [ ] Documentation is complete and accurate
- [ ] No breaking changes to existing functionality
- [ ] JSON output can be consumed by standard tools (jq, Python, etc.)

## Future Enhancements (Out of Scope)
- Multiple output formats (XML, CSV, YAML)
- Custom JSON schemas
- Streaming JSON output for large codebases
- Output file option (`--output-file result.json`)
- Filtering/querying capabilities in JSON output
