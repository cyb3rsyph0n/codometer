import { BaseParser } from './base-parser';
import { ParserResult } from '../core/types';

export class MarkdownParser extends BaseParser {
  getSupportedExtensions(): string[] {
    return ['md', 'markdown'];
  }

  getLanguageName(): string {
    return 'Markdown';
  }

  parse(content: string): ParserResult {
    const lines = content.split('\n');
    let blankLines = 0;

    for (const line of lines) {
      if (this.isBlankLine(line)) {
        blankLines++;
      }
    }

    const totalLines = lines.length;
    const commentLines = totalLines - blankLines;

    return {
      codeLines: 0,
      commentLines,
      blankLines,
    };
  }
}
