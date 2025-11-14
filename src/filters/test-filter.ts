import { PatternMatcher, parsePatterns } from './pattern-matcher';

export class TestFilter {
  private matcher: PatternMatcher | null = null;

  constructor(excludeTestsPattern?: string) {
    if (excludeTestsPattern) {
      const patterns = parsePatterns(excludeTestsPattern);
      if (patterns.length > 0) {
        this.matcher = new PatternMatcher(patterns);
      }
    }
  }

  shouldExclude(filePath: string): boolean {
    if (!this.matcher) return false;
    return this.matcher.matches(filePath);
  }
}
