import { PatternMatcher, parsePatterns } from './pattern-matcher';

describe('PatternMatcher', () => {
  test('should match exact file names', () => {
    const matcher = new PatternMatcher(['test.js']);
    expect(matcher.matches('test.js')).toBe(true);
    expect(matcher.matches('other.js')).toBe(false);
  });

  test('should match wildcard patterns', () => {
    const matcher = new PatternMatcher(['*.spec.ts']);
    expect(matcher.matches('file.spec.ts')).toBe(true);
    expect(matcher.matches('src/file.spec.ts')).toBe(true);
    expect(matcher.matches('file.ts')).toBe(false);
  });

  test('should match directory patterns', () => {
    const matcher = new PatternMatcher(['**/__tests__/**']);
    expect(matcher.matches('src/__tests__/file.ts')).toBe(true);
    expect(matcher.matches('__tests__/file.ts')).toBe(true);
    expect(matcher.matches('src/file.ts')).toBe(false);
  });

  test('should match multiple patterns', () => {
    const matcher = new PatternMatcher(['*.spec.ts', '*.test.ts']);
    expect(matcher.matches('file.spec.ts')).toBe(true);
    expect(matcher.matches('file.test.ts')).toBe(true);
    expect(matcher.matches('file.ts')).toBe(false);
  });

  test('should handle root-relative patterns', () => {
    const matcher = new PatternMatcher(['/dist']);
    expect(matcher.matches('/dist')).toBe(true);
    expect(matcher.matches('dist')).toBe(false);
    expect(matcher.matches('src/dist')).toBe(false);
  });

  test('should handle patterns with question marks', () => {
    const matcher = new PatternMatcher(['file?.ts']);
    expect(matcher.matches('file1.ts')).toBe(true);
    expect(matcher.matches('file/file1.ts')).toBe(true);
    expect(matcher.matches('fileab.ts')).toBe(false);
  });
});

describe('parsePatterns', () => {
  test('should parse comma-separated patterns', () => {
    const patterns = parsePatterns('*.spec.ts,*.test.ts,**/__tests__/**');
    expect(patterns).toHaveLength(3);
    expect(patterns).toContain('*.spec.ts');
    expect(patterns).toContain('*.test.ts');
    expect(patterns).toContain('**/__tests__/**');
  });

  test('should handle empty string', () => {
    const patterns = parsePatterns('');
    expect(patterns).toHaveLength(0);
  });

  test('should trim whitespace', () => {
    const patterns = parsePatterns('*.spec.ts , *.test.ts');
    expect(patterns).toHaveLength(2);
    expect(patterns).toContain('*.spec.ts');
    expect(patterns).toContain('*.test.ts');
  });
});
