import { BaseParser } from './base-parser';
import { ParserResult } from '../core/types';

export class CSharpParser extends BaseParser {
  getSupportedExtensions(): string[] {
    return ['cs'];
  }

  getLanguageName(): string {
    return 'C#';
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
      } else if (trimmed.startsWith('///') || trimmed.startsWith('//')) {
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
