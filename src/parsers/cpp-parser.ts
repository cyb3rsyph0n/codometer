import { BaseParser } from './base-parser';
import { ParserResult } from '../core/types';

export class CppParser extends BaseParser {
  getSupportedExtensions(): string[] {
    return ['cpp', 'cc', 'cxx', 'c', 'h', 'hpp', 'hxx', 'hh'];
  }

  getLanguageName(): string {
    return 'C/C++';
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
      } else if (trimmed.startsWith('//')) {
        commentLines++;
        isComment = true;
      } else if (trimmed.startsWith('/*')) {
        commentLines++;
        isComment = true;
        if (!trimmed.includes('*/')) {
          inBlockComment = true;
        }
      }

      if (!isComment && !inBlockComment && trimmed.length > 0) {
        codeLines++;
      }
    }

    return { codeLines, commentLines, blankLines };
  }
}
