import { parseCliArgs } from './cli-parser';

describe('parseCliArgs', () => {
  test('should parse path argument', () => {
    const options = parseCliArgs(['./src']);
    expect(options.path).toBe('./src');
  });

  test('should parse --ignore-gitignore flag', () => {
    const options = parseCliArgs(['--ignore-gitignore']);
    expect(options.ignoreGitignore).toBe(true);
  });

  test('should parse --exclude-tests flag', () => {
    const options = parseCliArgs(['--exclude-tests=*.spec.ts']);
    expect(options.excludeTests).toBe('*.spec.ts');
  });

  test('should parse --follow-symlinks flag', () => {
    const options = parseCliArgs(['--follow-symlinks']);
    expect(options.followSymlinks).toBe(true);
  });

  test('should parse --include-hidden flag', () => {
    const options = parseCliArgs(['--include-hidden']);
    expect(options.includeHidden).toBe(true);
  });

  test('should parse --verbose flag', () => {
    const options = parseCliArgs(['--verbose']);
    expect(options.verbose).toBe(true);
  });

  test('should parse --help flag', () => {
    const options = parseCliArgs(['--help']);
    expect(options.help).toBe(true);
  });

  test('should parse --version flag', () => {
    const options = parseCliArgs(['--version']);
    expect(options.version).toBe(true);
  });

  test('should parse multiple flags', () => {
    const options = parseCliArgs(['./src', '--verbose', '--ignore-gitignore']);
    expect(options.path).toBe('./src');
    expect(options.verbose).toBe(true);
    expect(options.ignoreGitignore).toBe(true);
  });

  test('should parse --output-json flag', () => {
    const options = parseCliArgs(['--output-json']);
    expect(options.outputJson).toBe(true);
  });

  test('should parse --silent flag', () => {
    const options = parseCliArgs(['--silent']);
    expect(options.silent).toBe(true);
  });

  test('should parse --output-json and --silent together', () => {
    const options = parseCliArgs(['--output-json', '--silent']);
    expect(options.outputJson).toBe(true);
    expect(options.silent).toBe(true);
  });

  test('should parse all flags together', () => {
    const options = parseCliArgs([
      './src',
      '--verbose',
      '--ignore-gitignore',
      '--output-json',
      '--silent',
    ]);
    expect(options.path).toBe('./src');
    expect(options.verbose).toBe(true);
    expect(options.ignoreGitignore).toBe(true);
    expect(options.outputJson).toBe(true);
    expect(options.silent).toBe(true);
  });

  test('should have default values', () => {
    const options = parseCliArgs([]);
    expect(options.ignoreGitignore).toBe(false);
    expect(options.followSymlinks).toBe(false);
    expect(options.includeHidden).toBe(false);
    expect(options.verbose).toBe(false);
    expect(options.help).toBe(false);
    expect(options.version).toBe(false);
    expect(options.outputJson).toBe(false);
    expect(options.silent).toBe(false);
  });
});

describe('getHelpText', () => {
  test('should return help text', () => {
    const { getHelpText } = require('./cli-parser');
    const helpText = getHelpText();
    expect(helpText).toContain('codometer');
    expect(helpText).toContain('Usage:');
    expect(helpText).toContain('Options:');
    expect(helpText).toContain('--ignore-gitignore');
    expect(helpText).toContain('--output-json');
    expect(helpText).toContain('--silent');
    expect(helpText).toContain('Examples:');
  });
});
