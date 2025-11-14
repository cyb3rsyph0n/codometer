import { BaseParser } from './base-parser';
import { ParserResult } from '../core/types';

export class PythonParser extends BaseParser {
  getSupportedExtensions(): string[] {
    return ['py', 'pyw'];
  }

  getLanguageName(): string {
    return 'Python';
  }

  parse(content: string): ParserResult {
    const lines = content.split('\n');
    let codeLines = 0;
    let commentLines = 0;
    let blankLines = 0;
    let inDocstring = false;
    let docstringDelimiter = '';

    for (const line of lines) {
      const trimmed = line.trim();

      if (this.isBlankLine(line)) {
        blankLines++;
        continue;
      }

      if (inDocstring) {
        commentLines++;
        if (trimmed.includes(docstringDelimiter)) {
          inDocstring = false;
          docstringDelimiter = '';
        }
        continue;
      }

      if (trimmed.startsWith('"""') || trimmed.startsWith("'''")) {
        const delimiter = trimmed.substring(0, 3);
        commentLines++;

        const afterDelimiter = trimmed.substring(3);
        if (!afterDelimiter.includes(delimiter)) {
          inDocstring = true;
          docstringDelimiter = delimiter;
        }
        continue;
      }

      if (trimmed.startsWith('#')) {
        commentLines++;
        continue;
      }

      const hashIndex = this.findCommentStart(trimmed);
      if (hashIndex !== -1) {
        const beforeComment = trimmed.substring(0, hashIndex).trim();
        if (beforeComment.length > 0) {
          codeLines++;
        } else {
          commentLines++;
        }
      } else {
        codeLines++;
      }
    }

    return { codeLines, commentLines, blankLines };
  }

  private findCommentStart(line: string): number {
    let inString = false;
    let stringChar = '';
    let escaped = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        continue;
      }

      if ((char === '"' || char === "'") && !inString) {
        inString = true;
        stringChar = char;
        continue;
      }

      if (char === stringChar && inString) {
        inString = false;
        stringChar = '';
        continue;
      }

      if (!inString && char === '#') {
        return i;
      }
    }

    return -1;
  }
}
