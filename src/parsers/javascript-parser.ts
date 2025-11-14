import { BaseParser } from './base-parser';
import { ParserResult } from '../core/types';

export class JavaScriptParser extends BaseParser {
  getSupportedExtensions(): string[] {
    return ['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'];
  }

  getLanguageName(): string {
    return 'JavaScript/TypeScript';
  }

  parse(content: string): ParserResult {
    const lines = content.split('\n');
    let codeLines = 0;
    let commentLines = 0;
    let blankLines = 0;
    let inBlockComment = false;

    for (const line of lines) {
      const trimmed = line.trim();

      if (this.isBlankLine(line)) {
        blankLines++;
        continue;
      }

      let isComment = false;

      if (inBlockComment) {
        commentLines++;
        isComment = true;
        if (trimmed.includes('*/')) {
          inBlockComment = false;
        }
      } else if (trimmed.startsWith('/*')) {
        commentLines++;
        isComment = true;
        if (!trimmed.includes('*/') || trimmed.indexOf('/*') < trimmed.lastIndexOf('/*')) {
          inBlockComment = true;
        }
      } else if (trimmed.startsWith('//')) {
        commentLines++;
        isComment = true;
      } else {
        const commentStart = this.findCommentStart(trimmed);
        if (commentStart !== -1) {
          if (this.hasSubstantialCode(trimmed.substring(0, commentStart))) {
            codeLines++;
            isComment = false;
          } else {
            commentLines++;
            isComment = true;
          }
        }
      }

      if (
        !isComment &&
        !inBlockComment &&
        trimmed.length > 0 &&
        this.findCommentStart(trimmed) === -1
      ) {
        codeLines++;
      }
    }

    return { codeLines, commentLines, blankLines };
  }

  private findCommentStart(line: string): number {
    let inString = false;
    let stringChar = '';
    let escaped = false;

    for (let i = 0; i < line.length - 1; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        continue;
      }

      if ((char === '"' || char === "'" || char === '`') && !inString) {
        inString = true;
        stringChar = char;
        continue;
      }

      if (char === stringChar && inString) {
        inString = false;
        stringChar = '';
        continue;
      }

      if (!inString) {
        if (char === '/' && nextChar === '/') {
          return i;
        }
        if (char === '/' && nextChar === '*') {
          return i;
        }
      }
    }

    return -1;
  }

  private hasSubstantialCode(str: string): boolean {
    const trimmed = str.trim();
    return trimmed.length > 0 && !trimmed.match(/^[{}[\]();,]*$/);
  }
}
