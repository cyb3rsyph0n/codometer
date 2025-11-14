import { promises as fs } from 'fs';
import { join } from 'path';
import { PatternMatcher } from './pattern-matcher';

interface GitignoreRule {
  pattern: string;
  negation: boolean;
  directoryOnly: boolean;
}

export class GitignoreParser {
  private rules: GitignoreRule[] = [];
  private matchers: Map<string, PatternMatcher> = new Map();

  async loadGitignore(rootPath: string): Promise<void> {
    try {
      const gitignorePath = join(rootPath, '.gitignore');
      const content = await fs.readFile(gitignorePath, 'utf-8');
      this.parseGitignore(content, rootPath);
    } catch {
      // No .gitignore file found, that's okay
    }
  }

  private parseGitignore(content: string, _basePath: string): void {
    const lines = content.split('\n');

    for (let line of lines) {
      line = line.trim();

      if (!line || line.startsWith('#')) {
        continue;
      }

      let negation = false;
      let directoryOnly = false;

      if (line.startsWith('!')) {
        negation = true;
        line = line.substring(1);
      }

      if (line.endsWith('/')) {
        directoryOnly = true;
        line = line.substring(0, line.length - 1);
      }

      if (line.startsWith('/')) {
        line = line.substring(1);
      }

      this.rules.push({
        pattern: line,
        negation,
        directoryOnly,
      });
    }
  }

  shouldIgnore(filePath: string, rootPath: string, isDirectory: boolean): boolean {
    const relativePath = filePath.startsWith(rootPath)
      ? filePath.substring(rootPath.length + 1).replace(/\\/g, '/')
      : filePath.replace(/\\/g, '/');

    let ignored = false;

    for (const rule of this.rules) {
      if (rule.directoryOnly && !isDirectory) {
        continue;
      }

      const matchKey = rule.pattern;
      if (!this.matchers.has(matchKey)) {
        this.matchers.set(matchKey, new PatternMatcher([rule.pattern]));
      }

      const matcher = this.matchers.get(matchKey)!;
      if (matcher.matches(relativePath)) {
        ignored = !rule.negation;
      }
    }

    return ignored;
  }
}
