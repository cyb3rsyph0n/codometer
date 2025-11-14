import { TestFilter } from './test-filter';

describe('TestFilter', () => {
  test('should not exclude when no pattern is provided', () => {
    const filter = new TestFilter();
    expect(filter.shouldExclude('test.spec.ts')).toBe(false);
    expect(filter.shouldExclude('src/file.ts')).toBe(false);
  });

  test('should exclude files matching pattern', () => {
    const filter = new TestFilter('*.spec.ts');
    expect(filter.shouldExclude('test.spec.ts')).toBe(true);
    expect(filter.shouldExclude('file.ts')).toBe(false);
  });

  test('should handle multiple patterns', () => {
    const filter = new TestFilter('*.spec.ts,*.test.ts');
    expect(filter.shouldExclude('test.spec.ts')).toBe(true);
    expect(filter.shouldExclude('test.test.ts')).toBe(true);
    expect(filter.shouldExclude('file.ts')).toBe(false);
  });

  test('should handle empty pattern string', () => {
    const filter = new TestFilter('');
    expect(filter.shouldExclude('test.spec.ts')).toBe(false);
  });
});
