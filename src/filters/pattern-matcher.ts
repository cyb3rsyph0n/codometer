export class PatternMatcher {
  private patterns: RegExp[] = [];

  constructor(globPatterns: string[]) {
    this.patterns = globPatterns.map((pattern) => this.globToRegex(pattern));
  }

  matches(path: string): boolean {
    const normalizedPath = path.replace(/\\/g, '/');
    return this.patterns.some((pattern) => pattern.test(normalizedPath));
  }

  private globToRegex(glob: string): RegExp {
    let regex = glob.replace(/\\/g, '/');

    regex = regex.replace(/[.+^${}()|[\]\\]/g, '\\$&');

    regex = regex.replace(/\*\*/g, '<!DOUBLESTAR!>');
    regex = regex.replace(/\*/g, '[^/]*');
    regex = regex.replace(/<!DOUBLESTAR!>/g, '.*');

    regex = regex.replace(/\?/g, '[^/]');

    if (regex.startsWith('.*')) {
      const rest = regex.substring(2);
      regex = '^(.*' + rest + '|' + rest.substring(1) + ')$';
    } else if (!regex.startsWith('/')) {
      regex = '(^|/)' + regex + '$';
    } else {
      regex = '^' + regex + '$';
    }

    return new RegExp(regex);
  }
}

export function parsePatterns(patternString: string): string[] {
  if (!patternString) return [];
  return patternString
    .split(',')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}
